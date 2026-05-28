from __future__ import annotations

from typing import Any

from fastapi.responses import JSONResponse


def problem_details(
	*,
	type: str,
	title: str,
	detail: str,
	status: int,
	extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
	payload: dict[str, Any] = {
		"type": type,
		"title": title,
		"detail": detail,
		"status": status,
	}
	if extra:
		payload.update(extra)
	return payload


def problem_response(payload: dict[str, Any], status_code: int | None = None) -> JSONResponse:
	return JSONResponse(
		status_code=status_code or int(payload.get("status", 422)),
		content=payload,
		media_type="application/problem+json",
	)