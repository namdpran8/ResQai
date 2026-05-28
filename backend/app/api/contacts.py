from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.errors import problem_details
from app.db.repository import create_contact, delete_contact, list_contacts
from app.db.session import get_db
from app.models.request_models import EmergencyContactCreateRequest
from app.models.response_models import EmergencyContactResponse


router = APIRouter()


@router.get("/contacts", response_model=list[EmergencyContactResponse])
def get_contacts(user_id: str = Query(..., min_length=1, max_length=255), db=Depends(get_db)):
	return list_contacts(db, user_id)


@router.post("/contacts", response_model=EmergencyContactResponse)
def add_contact(payload: EmergencyContactCreateRequest, db=Depends(get_db)):
	try:
		return create_contact(db, payload.model_dump())
	except ValueError as exc:
		raise HTTPException(
			status_code=422,
			detail=problem_details(
				type="validation_error",
				title="Invalid emergency contact",
				detail=str(exc),
				status=422,
			),
		) from exc


@router.delete("/contacts/{contact_id}")
def remove_contact(contact_id: UUID, user_id: str = Query(..., min_length=1, max_length=255), db=Depends(get_db)):
	deleted = delete_contact(db, contact_id, user_id)
	if not deleted:
		raise HTTPException(
			status_code=404,
			detail=problem_details(
				type="not_found",
				title="Contact not found",
				detail="The contact does not exist or does not belong to the supplied user_id.",
				status=404,
			),
		)
	return {"status": "deleted", "contact_id": str(contact_id)}
