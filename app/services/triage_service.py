"""Top-level triage service wrapper.

This module attempts to re-export the backend implementation located at
`backend/app/services/triage_service.py`. When running the prototype backend
server, that backend implementation is the canonical source of truth. If the
backend module cannot be loaded (for example when running tests in a different
layout), this file falls back to a minimal local skeleton.

This keeps a single implementation surface for the backend while allowing the
top-level `app/services` copy (used for developer notes) to remain in sync.
"""

from importlib import util
import importlib
import os
import sys
from types import ModuleType


def _load_backend_impl() -> ModuleType | None:
    # Prefer direct package import if available (when backend is on PYTHONPATH)
    try:
        return importlib.import_module("backend.app.services.triage_service")
    except Exception:
        pass

    # Fallback: attempt to load by file path relative to repository root
    here = os.path.abspath(os.path.dirname(__file__))  # .../RoadSoS/app/services
    repo_root = os.path.abspath(os.path.join(here, "..", ".."))  # .../RoadSoS
    backend_path = os.path.join(repo_root, "backend", "app", "services", "triage_service.py")
    if os.path.exists(backend_path):
        spec = util.spec_from_file_location("_backend_triage_impl", backend_path)
        if spec and spec.loader:
            module = util.module_from_spec(spec)
            sys.modules[spec.name] = module
            spec.loader.exec_module(module)
            return module
    return None


_impl = _load_backend_impl()


if _impl is not None:
    # Re-export functions and constants from backend implementation
    for name in ("triage", "triage_stream", "triage_bundle", "classify_severity", "generate_triage_response_async"):
        if hasattr(_impl, name):
            globals()[name] = getattr(_impl, name)

    # Also re-export helper if present
    if hasattr(_impl, "TRIAGE_REQUIRED_KEYS"):
        TRIAGE_REQUIRED_KEYS = getattr(_impl, "TRIAGE_REQUIRED_KEYS")
else:
    # Minimal local skeleton fallback (keeps developer notes functional)
    import asyncio
    import json
    import re
    from typing import Dict, Any

    TRIAGE_SYSTEM_PROMPT = """
    You are RoadSoS, an emergency triage assistant for road accident victims in India.
    """


    def _sanitize_description(text: str) -> str:
        if not text:
            return text
        patterns = [r"ignore previous instructions", r"you are now", r"system:", r"assistant:"]
        cleaned = text
        for p in patterns:
            cleaned = re.sub(p, "", cleaned, flags=re.IGNORECASE)
        return cleaned.strip()[:500]


    def _safe_default_response() -> Dict[str, Any]:
        return {
            "severity": "CRITICAL",
            "confidence": 0.9,
            "priority_order": ["ambulance", "hospital", "police"],
            "first_aid_steps": [
                "Call emergency services immediately (call +911).",
                "Check airway, breathing and circulation; if absent, start CPR if trained.",
                "Apply firm, direct pressure to severe bleeding.",
                "Do not move the patient if spinal injury suspected.",
                "Keep the person warm and monitor consciousness.",
            ],
            "do_not_do": ["Do not move the patient if spinal injury suspected"],
            "call_now": "+911",
            "reassurance_message": "Help is on the way. You are doing the right thing.",
            "estimated_risk": "life-threatening",
        }


    async def triage(description: str, lat: float = None, lng: float = None, timeout: float = 8.0) -> Dict[str, Any]:
        desc = _sanitize_description(description or "")
        if not desc:
            return {"error": "empty_description", "detail": "Description must be provided (max 500 chars)."}
        await asyncio.sleep(0.01)
        return _safe_default_response()


    async def triage_stream(description: str, lat: float = None, lng: float = None):
        # Minimal SSE style generator: immediate preview, then final
        preview = {"preview": {"note": "preview not available in fallback"}}
        yield f"event: first_aid\ndata: {json.dumps(preview)}\n\n"
        result = await triage(description, lat, lng)
        yield f"event: final\ndata: {json.dumps({'triage': result})}\n\n"


    def triage_bundle(description: str, lat: float = None, lng: float = None) -> dict[str, Any]:
        # Synchronous bundle helper for quick testing
        return {"triage": _safe_default_response(), "nearby_facility": None}

