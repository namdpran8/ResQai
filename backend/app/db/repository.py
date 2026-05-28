from __future__ import annotations

from collections import defaultdict
from copy import deepcopy
from datetime import datetime, timezone
from uuid import UUID, uuid4, uuid5, NAMESPACE_URL

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import EmergencyContact, Facility, SOSEvent
from app.db.seed import FACILITY_SEEDS


LOCAL_CONTACTS: dict[str, list[dict]] = defaultdict(list)
LOCAL_SOS_EVENTS: dict[str, dict] = {}


def _local_facility_id(place_id: str) -> str:
	return str(uuid5(NAMESPACE_URL, f"roadsos:facility:{place_id}"))


def _facility_to_payload(facility: Facility | dict) -> dict:
	if isinstance(facility, dict):
		data = deepcopy(facility)
	else:
		data = {
			"id": str(facility.id),
			"place_id": facility.place_id,
			"name": facility.name,
			"facility_type": facility.facility_type,
			"address": facility.address,
			"phone": facility.phone,
			"latitude": float(facility.latitude),
			"longitude": float(facility.longitude),
			"specialties": list(facility.specialties or []),
			"is_247": bool(facility.is_247),
			"verified_at": facility.verified_at.isoformat() if facility.verified_at else None,
			"created_at": facility.created_at.isoformat() if facility.created_at else None,
		}

	data["location"] = {"lat": float(data["latitude"]), "lng": float(data["longitude"])}
	data["specialties"] = list(data.get("specialties") or [])
	data["id"] = str(data.get("id") or _local_facility_id(str(data["place_id"])))
	return data


def list_facilities(session: Session | None = None) -> list[dict]:
	if session is not None:
		rows = session.execute(select(Facility).order_by(Facility.facility_type, Facility.name)).scalars().all()
		return [_facility_to_payload(row) for row in rows]

	return [
		{
			"id": _local_facility_id(item["place_id"]),
			**deepcopy(item),
			"location": {"lat": item["latitude"], "lng": item["longitude"]},
			"specialties": list(item.get("specialties") or []),
		}
		for item in FACILITY_SEEDS
	]


def get_facility_by_place_id(session: Session | None, place_id: str) -> dict | None:
	if session is not None:
		facility = session.execute(select(Facility).where(Facility.place_id == place_id)).scalar_one_or_none()
		return _facility_to_payload(facility) if facility else None

	for facility in list_facilities(None):
		if facility["place_id"] == place_id:
			return facility
	return None


def list_contacts(session: Session | None, user_id: str) -> list[dict]:
	if session is not None:
		rows = session.execute(select(EmergencyContact).where(EmergencyContact.user_id == user_id).order_by(EmergencyContact.is_primary.desc(), EmergencyContact.created_at.asc())).scalars().all()
		return [
			{
				"id": str(row.id),
				"user_id": row.user_id,
				"name": row.name,
				"phone": row.phone,
				"relation": row.relation,
				"is_primary": bool(row.is_primary),
				"created_at": row.created_at.isoformat() if row.created_at else None,
			}
			for row in rows
		]

	contacts = deepcopy(LOCAL_CONTACTS.get(user_id, []))
	contacts.sort(key=lambda item: (not item.get("is_primary", False), item.get("created_at") or ""))
	return contacts


def get_contact(session: Session | None, contact_id: UUID) -> dict | None:
	if session is not None:
		row = session.get(EmergencyContact, contact_id)
		if row is None:
			return None
		return {
			"id": str(row.id),
			"user_id": row.user_id,
			"name": row.name,
			"phone": row.phone,
			"relation": row.relation,
			"is_primary": bool(row.is_primary),
			"created_at": row.created_at.isoformat() if row.created_at else None,
		}

	for contacts in LOCAL_CONTACTS.values():
		for contact in contacts:
			if contact.get("id") == str(contact_id):
				return deepcopy(contact)
	return None


def create_contact(session: Session | None, payload: dict) -> dict:
	user_id = payload["user_id"]
	if len(list_contacts(session, user_id)) >= 5:
		raise ValueError("A user can store at most 5 emergency contacts")

	if session is not None:
		contact = EmergencyContact(
			user_id=user_id,
			name=payload["name"],
			phone=payload["phone"],
			relation=payload.get("relation"),
			is_primary=bool(payload.get("is_primary", False)),
		)
		session.add(contact)
		session.commit()
		session.refresh(contact)
		return {
			"id": str(contact.id),
			"user_id": contact.user_id,
			"name": contact.name,
			"phone": contact.phone,
			"relation": contact.relation,
			"is_primary": bool(contact.is_primary),
			"created_at": contact.created_at.isoformat() if contact.created_at else None,
		}

	contact = {
		"id": str(uuid4()),
		"user_id": user_id,
		"name": payload["name"],
		"phone": payload["phone"],
		"relation": payload.get("relation"),
		"is_primary": bool(payload.get("is_primary", False)),
		"created_at": datetime.now(timezone.utc).isoformat(),
	}
	LOCAL_CONTACTS[user_id].append(contact)
	return deepcopy(contact)


def delete_contact(session: Session | None, contact_id: UUID, user_id: str) -> bool:
	if session is not None:
		contact = session.get(EmergencyContact, contact_id)
		if contact is None or contact.user_id != user_id:
			return False
		session.delete(contact)
		session.commit()
		return True

	contacts = LOCAL_CONTACTS.get(user_id, [])
	filtered = [contact for contact in contacts if contact.get("id") != str(contact_id)]
	if len(filtered) == len(contacts):
		return False
	LOCAL_CONTACTS[user_id] = filtered
	return True


def get_sos_event(session: Session | None, sos_id: UUID) -> dict | None:
	if session is not None:
		row = session.get(SOSEvent, sos_id)
		if row is None:
			return None
		return {
			"id": str(row.id),
			"user_id": row.user_id,
			"latitude": float(row.latitude) if row.latitude is not None else None,
			"longitude": float(row.longitude) if row.longitude is not None else None,
			"severity": row.severity,
			"status": row.status,
			"contacts_alerted": int(row.contacts_alerted or 0),
			"facility_id": str(row.facility_id) if row.facility_id else None,
			"created_at": row.created_at.isoformat() if row.created_at else None,
			"resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
		}

	return deepcopy(LOCAL_SOS_EVENTS.get(str(sos_id)))


def create_sos_event(
	session: Session | None,
	*,
	user_id: str,
	latitude: float,
	longitude: float,
	severity: str,
	facility_id: str | None,
	contacts_alerted: int,
	status: str = "sent",
) -> dict:
	if session is not None:
		event = SOSEvent(
			user_id=user_id,
			latitude=latitude,
			longitude=longitude,
			severity=severity,
			status=status,
			contacts_alerted=contacts_alerted,
			facility_id=UUID(facility_id) if facility_id else None,
		)
		session.add(event)
		session.commit()
		session.refresh(event)
		return {
			"id": str(event.id),
			"user_id": event.user_id,
			"latitude": float(event.latitude) if event.latitude is not None else None,
			"longitude": float(event.longitude) if event.longitude is not None else None,
			"severity": event.severity,
			"status": event.status,
			"contacts_alerted": int(event.contacts_alerted or 0),
			"facility_id": str(event.facility_id) if event.facility_id else None,
			"created_at": event.created_at.isoformat() if event.created_at else None,
			"resolved_at": event.resolved_at.isoformat() if event.resolved_at else None,
		}

	event_id = str(uuid4())
	event = {
		"id": event_id,
		"user_id": user_id,
		"latitude": latitude,
		"longitude": longitude,
		"severity": severity,
		"status": status,
		"contacts_alerted": contacts_alerted,
		"facility_id": facility_id,
		"created_at": datetime.now(timezone.utc).isoformat(),
		"resolved_at": None,
	}
	LOCAL_SOS_EVENTS[event_id] = event
	return deepcopy(event)


def update_sos_event_status(session: Session | None, sos_id: UUID, status: str) -> dict | None:
	if session is not None:
		row = session.get(SOSEvent, sos_id)
		if row is None:
			return None
		row.status = status
		row.resolved_at = datetime.now(timezone.utc) if status == "cancelled" else row.resolved_at
		session.commit()
		session.refresh(row)
		return get_sos_event(session, sos_id)

	event = LOCAL_SOS_EVENTS.get(str(sos_id))
	if event is None:
		return None
	event["status"] = status
	if status == "cancelled":
		event["resolved_at"] = datetime.now(timezone.utc).isoformat()
	return deepcopy(event)