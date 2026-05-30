from __future__ import annotations

import asyncio
import json
import logging
import threading
from collections.abc import AsyncIterator

try:
    import google.genai as genai
except Exception:  # pragma: no cover - optional dependency fallback
    genai = None

from app.core.config import GEMINI_API_KEY


logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-1.5-flash"

client = genai.Client(api_key=GEMINI_API_KEY) if genai and GEMINI_API_KEY else None


def _mock_triage_from_prompt(prompt: str) -> str:
    """Produce a small JSON triage response based on keywords in the prompt.

    This is a prototype fallback used when no Gemini key is configured.
    It should mirror the expected LLM JSON shape used by the triage service.
    """
    text = prompt.lower()
    severity = "CRITICAL"
    if any(k in text for k in ("unconscious", "not breathing", "severe bleeding", "chest pain", "spinal")):
        severity = "CRITICAL"
    elif any(k in text for k in ("fracture", "broken", "head", "moderate bleeding", "cannot move")):
        severity = "SERIOUS"
    elif any(k in text for k in ("minor", "scratch", "bruise", "no injuries", "walking wounded")):
        severity = "MINOR"

    response = {
        "severity": severity,
        "confidence": 0.8,
        "priority_order": ["ambulance", "hospital", "police"] if severity == "CRITICAL" else ["hospital", "ambulance"],
        "first_aid_steps": [
            "Call emergency services immediately",
            "Check airway and breathing",
            "Apply pressure to severe bleeding",
        ],
        "do_not_do": ["Do not move the patient if spinal injury suspected"],
        "call_now": "+911",
        "reassurance_message": "Help is on the way. You are doing the right thing.",
        "estimated_risk": "life-threatening" if severity == "CRITICAL" else ("moderate" if severity == "SERIOUS" else "low"),
    }
    return json.dumps(response, ensure_ascii=False)


async def generate_gemini_text(prompt: str, timeout_seconds: int = 8) -> str:
    if client is None:
        # Prototype fallback: return a mock triage JSON based on prompt keywords
        return await asyncio.wait_for(asyncio.to_thread(_mock_triage_from_prompt, prompt), timeout=timeout_seconds)

    def _call() -> str:
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            return getattr(response, "text", "") or ""
        except Exception as exc:
            logger.exception("Gemini generate_text failed, falling back to mock: %s", exc)
            return _mock_triage_from_prompt(prompt)

    return await asyncio.wait_for(asyncio.to_thread(_call), timeout=timeout_seconds)


async def stream_gemini_text(prompt: str) -> AsyncIterator[str]:
    if client is None:
        # Prototype fallback: stream the mock response in one chunk
        yield _mock_triage_from_prompt(prompt)
        return

    queue: asyncio.Queue[str | None] = asyncio.Queue()
    loop = asyncio.get_running_loop()

    def _worker() -> None:
        try:
            stream = client.models.generate_content_stream(
                model=GEMINI_MODEL,
                contents=prompt,
            )
            for chunk in stream:
                text = getattr(chunk, "text", None)
                if text:
                    asyncio.run_coroutine_threadsafe(queue.put(text), loop)
        except Exception as exc:  # pragma: no cover - network dependent
            logger.exception("Gemini streaming failed: %s", exc)
            # On streaming failure, provide the mock response so caller can proceed
            asyncio.run_coroutine_threadsafe(queue.put(_mock_triage_from_prompt(prompt)), loop)
        finally:
            asyncio.run_coroutine_threadsafe(queue.put(None), loop)

    threading.Thread(target=_worker, daemon=True).start()

    while True:
        item = await queue.get()
        if item is None:
            break
        yield item