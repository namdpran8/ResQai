from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends

from app.db.session import get_db
from app.models.request_models import SOSRequest
from app.models.response_models import SOSCancelResponse, SOSResponse
from app.services.sos_service import cancel_sos_alert, create_sos_alert


router = APIRouter(prefix="/sos")


@router.post("", response_model=SOSResponse)
async def create_sos(payload: SOSRequest, db=Depends(get_db)):
	return create_sos_alert(payload, db)


@router.post("/{sos_id}/cancel", response_model=SOSCancelResponse)
async def cancel_sos(sos_id: UUID, db=Depends(get_db)):
	return await cancel_sos_alert(sos_id, db)