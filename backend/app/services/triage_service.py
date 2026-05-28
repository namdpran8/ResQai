from __future__ import annotations

import asyncio
import json
import logging
import re
from dataclasses import dataclass, field
from typing import Any

from app.core.prompts import TRIAGE_SYSTEM_PROMPT
from app.services.firstaid_service import detect_injury_type, get_first_aid, get_first_aid_guide
from app.services.gemini_service import generate_gemini_text, stream_gemini_text
from app.services.ranking import get_nearby_facility
from app.utils.validators import limit_description, looks_abusive_or_gibberish, sanitize_description
from app.utils.keyword_rules import CRITICAL_KEYWORDS, SERIOUS_KEYWORDS, MINOR_KEYWORDS


logger = logging.getLogger(__name__)


@dataclass
class SeverityResult:
    level: str
    matched_keywords: list[str] = field(default_factory=list)
    confidence: float = 0.0

TRIAGE_REQUIRED_KEYS = {
    "severity",
    "confidence",
    "priority_order",
    "first_aid_steps",
    "do_not_do",
    "call_now",
    "reassurance_message",
    "estimated_risk",
}

SAFE_DEFAULT_TRIAGE = {
    "severity": "CRITICAL",
    "confidence": 0.0,
    "priority_order": ["ambulance", "hospital", "police"],
    "first_aid_steps": [
        "Keep the scene safe and stop traffic if possible",
        "Call emergency help now",
        "Check breathing and bleeding immediately",
        "Do not move the patient if spinal injury is possible",
        "Stay with the patient until help arrives",
    ],
    "do_not_do": ["Do not move the patient if spinal injury is possible"],
    "call_now": "+911",
    "reassurance_message": "Help is on the way. You are doing the right thing.",
    "estimated_risk": "life-threatening",
}


def _build_prompt(description: str, lat: float, lng: float) -> str:
    return (
        f"{TRIAGE_SYSTEM_PROMPT}\n\n"
        f"Location: latitude={lat}, longitude={lng}\n"
        f"Description: {description}\n"
    )


def _strip_markdown_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def _extract_json_object(text: str) -> str:
    cleaned = _strip_markdown_fences(text)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        return cleaned[start : end + 1]
    return cleaned


def _normalize_list(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if str(item).strip()]
    if value is None:
        return []
    return [str(value)]


def _normalize_triage_payload(payload: dict[str, Any]) -> dict[str, Any] | None:
    if not isinstance(payload, dict):
        return None

    normalized = dict(payload)
    normalized["severity"] = str(normalized.get("severity", "CRITICAL")).upper()
    if normalized["severity"] not in {"CRITICAL", "SERIOUS", "MINOR"}:
        normalized["severity"] = "CRITICAL"

    try:
        normalized["confidence"] = float(normalized.get("confidence", 0.0))
    except (TypeError, ValueError):
        normalized["confidence"] = 0.0

    normalized["priority_order"] = _normalize_list(normalized.get("priority_order")) or SAFE_DEFAULT_TRIAGE["priority_order"]
    normalized["first_aid_steps"] = _normalize_list(normalized.get("first_aid_steps"))[:5] or SAFE_DEFAULT_TRIAGE["first_aid_steps"]
    normalized["do_not_do"] = _normalize_list(normalized.get("do_not_do")) or SAFE_DEFAULT_TRIAGE["do_not_do"]
    normalized["call_now"] = str(normalized.get("call_now", "+911")) or "+911"
    normalized["reassurance_message"] = str(normalized.get("reassurance_message", SAFE_DEFAULT_TRIAGE["reassurance_message"]))
    normalized["estimated_risk"] = str(normalized.get("estimated_risk", "life-threatening")).lower()
    if normalized["estimated_risk"] not in {"life-threatening", "moderate", "low"}:
        normalized["estimated_risk"] = "life-threatening"

    missing = TRIAGE_REQUIRED_KEYS.difference(normalized)
    if missing:
        return None

    return {key: normalized[key] for key in TRIAGE_REQUIRED_KEYS}


def _safe_default_triage() -> dict[str, Any]:
    return dict(SAFE_DEFAULT_TRIAGE)


def _classify_local_severity(description: str) -> str:
    text = description.lower()
    if any(keyword in text for keyword in ("unconscious", "not breathing", "severe bleeding", "blood", "chest pain", "spinal")):
        return "CRITICAL"
    if any(keyword in text for keyword in ("fracture", "broken", "head", "moderate bleeding", "cannot move", "can't move")):
        return "SERIOUS"
    if any(keyword in text for keyword in ("minor", "scratch", "bruise", "bruise", "no injuries", "walking wounded", "fender-bender")):
        return "MINOR"
    return "CRITICAL"


def _build_first_aid_preview(description: str) -> dict[str, Any]:
    severity = _classify_local_severity(description)
    injury_type = detect_injury_type(description)
    return get_first_aid_guide(severity, injury_type)


def _estimate_token_cost(description: str, triage_text: str) -> dict[str, Any]:
    input_tokens = max(128, len(description) // 4 + 220)
    output_tokens = max(96, len(triage_text) // 4 + 80)
    total_tokens = input_tokens + output_tokens
    return {
        "estimated_input_tokens": input_tokens,
        "estimated_output_tokens": output_tokens,
        "estimated_total_tokens": total_tokens,
        "budget_note": "Gemini Flash emergency triage budget estimate only; actual usage depends on prompt length and JSON output size.",
    }


async def triage(description: str, lat: float, lng: float) -> dict[str, Any]:
    description = limit_description(description, 500)
    sanitized = sanitize_description(description)

    if not sanitized or looks_abusive_or_gibberish(description):
        logger.warning("Unsafe or empty triage input received; returning critical fallback")
        return _safe_default_triage()

    prompt = _build_prompt(sanitized, lat, lng)

    try:
        raw_text = await generate_gemini_text(prompt, timeout_seconds=8)
        json_text = _extract_json_object(raw_text)
        parsed = json.loads(json_text)
        normalized = _normalize_triage_payload(parsed)
        if normalized is None:
            raise ValueError("LLM response missing required keys")
        return normalized
    except Exception as exc:
        logger.exception("Triage LLM parsing failed: %s", exc)
        return _safe_default_triage()


async def triage_stream(description: str, lat: float, lng: float):
    sanitized_description = limit_description(description, 500)
    preview = _build_first_aid_preview(sanitized_description)
    nearby_facility = get_nearby_facility(user_lat=lat, user_lng=lng)

    yield _sse_event(
        "first_aid",
        {
            "preview": preview,
            "nearby_facility": nearby_facility,
        },
    )

    if not sanitized_description or looks_abusive_or_gibberish(sanitized_description):
        fallback = _safe_default_triage()
        yield _sse_event(
            "final",
            {
                "triage": fallback,
                "nearby_facility": nearby_facility,
                "token_cost_estimate": _estimate_token_cost(sanitized_description, json.dumps(fallback, ensure_ascii=False)),
            },
        )
        return

    prompt = _build_prompt(sanitize_description(sanitized_description), lat, lng)
    collected_chunks: list[str] = []

    try:
        async with asyncio.timeout(8):
            async for chunk in stream_gemini_text(prompt):
                collected_chunks.append(chunk)
                yield _sse_event("triage_chunk", {"chunk": chunk})
    except Exception as exc:
        logger.exception("Triage stream failed: %s", exc)
        fallback = _safe_default_triage()
        yield _sse_event(
            "final",
            {
                "triage": fallback,
                "nearby_facility": nearby_facility,
                "token_cost_estimate": _estimate_token_cost(sanitized_description, json.dumps(fallback, ensure_ascii=False)),
            },
        )
        return

    raw_text = "".join(collected_chunks)
    try:
        parsed = json.loads(_extract_json_object(raw_text))
        triage_result = _normalize_triage_payload(parsed) or _safe_default_triage()
    except Exception as exc:
        logger.exception("Failed to parse streamed triage JSON: %s", exc)
        triage_result = _safe_default_triage()

    yield _sse_event(
        "final",
        {
            "triage": triage_result,
            "nearby_facility": nearby_facility,
            "token_cost_estimate": _estimate_token_cost(sanitized_description, raw_text or json.dumps(triage_result, ensure_ascii=False)),
        },
    )


async def triage_bundle(description: str, lat: float, lng: float) -> dict[str, Any]:
    triage_result = await triage(description, lat, lng)
    nearby_facility = get_nearby_facility(user_lat=lat, user_lng=lng)
    return {
        "triage": triage_result,
        "nearby_facility": nearby_facility,
        "token_cost_estimate": _estimate_token_cost(limit_description(description, 500), json.dumps(triage_result, ensure_ascii=False)),
    }


def _sse_event(event: str, data: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


def _matches_keyword(text: str, keyword: str) -> bool:
    pattern = re.escape(keyword)
    return re.search(rf"(?<!\w){pattern}(?!\w)", text) is not None


def classify_severity(text: str) -> SeverityResult:
    normalised = (text or "").lower()

    for level, keywords in (
        ("critical", CRITICAL_KEYWORDS),
        ("serious", SERIOUS_KEYWORDS),
        ("minor", MINOR_KEYWORDS),
    ):
        matched = [keyword for keyword in keywords if _matches_keyword(normalised, keyword)]
        if matched:
            confidence = min(1.0, len(matched) * 0.3)
            return SeverityResult(level=level, matched_keywords=matched, confidence=confidence)

    return SeverityResult(level="serious", matched_keywords=[], confidence=0.10)


def get_call_order(severity: str) -> list[str]:
    level = (severity or "serious").lower()
    if level == "critical":
        return ["ambulance", "hospital", "police"]
    if level == "minor":
        return ["clinic"]
    return ["hospital", "ambulance"]


def generate_triage_response(text: str) -> dict[str, Any]:
    if not text or not text.strip():
        return {
            "severity": "serious",
            "confidence": 0.0,
            "matched_keywords": [],
            "call_order": ["hospital", "ambulance"],
            "first_aid_steps": [],
            "ai_analysis": "No input provided",
        }

    severity_result = classify_severity(text)
    call_order = get_call_order(severity_result.level)
    first_aid_steps = get_first_aid(text)

    return {
        "severity": severity_result.level,
        "confidence": severity_result.confidence,
        "matched_keywords": severity_result.matched_keywords,
        "call_order": call_order,
        "first_aid_steps": first_aid_steps,
        "ai_analysis": "AI analysis temporarily unavailable",
    }


async def generate_triage_response_async(text: str) -> dict[str, Any]:
    return await asyncio.to_thread(generate_triage_response, text)
