from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import HTTPException

try:
	from twilio.base.exceptions import TwilioRestException
	from twilio.rest import Client as TwilioClient
except Exception:  # pragma: no cover - optional dependency fallback
	TwilioRestException = Exception
	TwilioClient = None

from app.core.config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
from app.core.errors import problem_details
from app.db.repository import (
	create_sos_event,
	get_sos_event,
	list_contacts,
	list_facilities,
	update_sos_event_status,
)
from app.models.request_models import SOSRequest
from app.services.ranking import rank_facilities


logger = logging.getLogger(__name__)
IST = ZoneInfo("Asia/Kolkata")
_background_tasks: set[asyncio.Task] = set()


def _schedule_task(coro: asyncio.Future) -> None:
	task = asyncio.create_task(coro)
	_background_tasks.add(task)
	task.add_done_callback(_background_tasks.discard)


def _get_twilio_client() -> TwilioClient | None:
	if TwilioClient is None:
		return None
	if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER):
		return None
	return TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def _nearest_hospital(facilities: list[dict], *, lat: float, lng: float, severity: str) -> dict:
	hospitals = [facility for facility in facilities if facility.get("facility_type") == "hospital"]
	ranked = rank_facilities(hospitals or facilities, user_lat=lat, user_lng=lng, user_severity=severity)
	return ranked[0] if ranked else {}


def _build_maps_url(lat: float, lng: float) -> str:
	return f"https://maps.google.com/?q={lat},{lng}"


def _compose_message(user_name: str | None, lat: float, lng: float, facility: dict) -> str:
	current_time = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S %Z")
	name = user_name or "Someone you know"
	facility_name = facility.get("name", "Nearest hospital")
	eta_minutes = facility.get("eta_minutes") or max(1, round(float(facility.get("eta", {}).get("duration_seconds", 0)) / 60))

	return (
		"🚨 EMERGENCY ALERT\n"
		f"{name} has been in a road accident.\n\n"
		f"Location: {_build_maps_url(lat, lng)}\n"
		f"Time: {current_time}\n\n"
		f"Nearest hospital: {facility_name} ({eta_minutes} min away)\n\n"
		"Reply HELP to get directions.\n"
		"— RoadSoS Emergency System"
	)


async def _send_sms_to_contact(contact: dict, message: str) -> bool:
	client = _get_twilio_client()
	if client is None:
		logger.warning("Twilio client is unavailable; skipping SMS to %s", contact.get("phone"))
		return False

	def _send() -> bool:
		try:
			client.messages.create(
				body=message,
				from_=TWILIO_FROM_NUMBER,
				to=contact["phone"],
			)
			return True
		except TwilioRestException as exc:
			logger.exception("Twilio failed for %s: %s", contact.get("phone"), exc)
			return False

	return await asyncio.to_thread(_send)


async def _dispatch_alerts(contacts: list[dict], message: str) -> int:
	results = await asyncio.gather(*[_send_sms_to_contact(contact, message) for contact in contacts], return_exceptions=True)
	return sum(1 for result in results if result is True)


def create_sos_alert(payload: SOSRequest, db=None) -> dict:
	facilities = list_facilities(db)
	nearest_facility = _nearest_hospital(facilities, lat=payload.lat, lng=payload.lng, severity=payload.severity.upper())
	contacts = list_contacts(db, payload.user_id)
	message = _compose_message(payload.user_id, payload.lat, payload.lng, nearest_facility)
	sos_event = create_sos_event(
		db,
		user_id=payload.user_id,
		latitude=payload.lat,
		longitude=payload.lng,
		severity=payload.severity.lower(),
		facility_id=nearest_facility.get("id"),
		contacts_alerted=len(contacts),
		status="sent",
	)

	if contacts:
		_schedule_task(_dispatch_alerts(contacts, message))

	eta_minutes = nearest_facility.get("eta_minutes") or max(1, round(float(nearest_facility.get("eta", {}).get("duration_seconds", 0)) / 60))
	return {
		"sos_id": sos_event["id"],
		"status": "sent",
		"contacts_alerted": len(contacts),
		"nearest_facility": {
			"name": nearest_facility.get("name"),
			"phone": nearest_facility.get("phone"),
			"eta_minutes": eta_minutes,
		},
		"message": f"SOS sent to {len(contacts)} contacts. Help is on the way.",
	}


async def cancel_sos_alert(sos_id, db=None) -> dict:
	sos_event = get_sos_event(db, sos_id)
	if sos_event is None:
		raise HTTPException(
			status_code=404,
			detail=problem_details(
				type="not_found",
				title="SOS event not found",
				detail=f"No SOS event exists for id '{sos_id}'",
				status=404,
			),
		)

	updated = update_sos_event_status(db, sos_id, "cancelled")
	contacts = list_contacts(db, updated["user_id"])
	client = _get_twilio_client()
	follow_up = "✅ False alarm — they are safe."

	if client is not None and contacts:
		await asyncio.gather(*[_send_sms_to_contact(contact, follow_up) for contact in contacts], return_exceptions=True)

	return {
		"sos_id": str(sos_id),
		"status": "cancelled",
		"message": "SOS cancelled and follow-up alerts sent.",
	}