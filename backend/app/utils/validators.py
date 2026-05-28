import re
from typing import Any

try:
	import phonenumbers
except Exception:  # pragma: no cover - optional dependency fallback
	phonenumbers = None


E164_PHONE_ERROR = "Phone must be in E.164 format, e.g. +919876543210"


INJECTION_PATTERNS = (
	"ignore previous instructions",
	"you are now",
	"system:",
	"assistant:",
)

ABUSE_PATTERNS = (
	"fuck",
	"shit",
	"bitch",
	"idiot",
	"kill yourself",
)


def limit_description(description: str, max_length: int = 500) -> str:
	return (description or "")[:max_length].strip()


def sanitize_description(description: str) -> str:
	text = limit_description(description)
	lowered = text.lower()

	for pattern in INJECTION_PATTERNS:
		lowered = lowered.replace(pattern, " ")

	cleaned = re.sub(r"\s+", " ", lowered).strip()
	return cleaned[:500]


def looks_abusive_or_gibberish(description: str) -> bool:
	text = (description or "").lower().strip()
	if not text:
		return True

	if any(pattern in text for pattern in ABUSE_PATTERNS):
		return True

	alpha_chars = sum(1 for char in text if char.isalpha())
	total_chars = len(text)
	if total_chars == 0:
		return True

	alpha_ratio = alpha_chars / total_chars
	repeated_noise = re.search(r"(.)\1{6,}", text) is not None
	too_many_symbols = sum(1 for char in text if not char.isalnum() and not char.isspace()) > max(12, total_chars // 3)

	return alpha_ratio < 0.25 or repeated_noise or too_many_symbols


def validate_e164_phone(phone: str) -> str:
	value = (phone or "").strip()
	if not value:
		raise ValueError(E164_PHONE_ERROR)

	if phonenumbers is not None:
		try:
			parsed = phonenumbers.parse(value, None)
			if not phonenumbers.is_valid_number(parsed):
				raise ValueError
			return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
		except Exception as exc:
			raise ValueError(E164_PHONE_ERROR) from exc

	if not re.fullmatch(r"\+[1-9]\d{7,14}", value):
		raise ValueError(E164_PHONE_ERROR)

	return value


def validate_uuid_string(value: Any) -> str:
	text = str(value or "").strip()
	if not text:
		raise ValueError("UUID is required")
	from uuid import UUID

	try:
		return str(UUID(text))
	except Exception as exc:
		raise ValueError("Invalid UUID format") from exc
