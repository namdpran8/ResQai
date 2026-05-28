from typing import Any, List

from pydantic import BaseModel, Field


class TriageResponse(BaseModel):
    severity: str
    confidence: float = Field(ge=0.0, le=1.0)
    priority_order: List[str]
    first_aid_steps: List[str]
    do_not_do: List[str] = Field(default_factory=list)
    call_now: str = "+911"
    reassurance_message: str
    estimated_risk: str


class TriageEnvelopeResponse(BaseModel):
    triage: TriageResponse
    nearby_facility: dict[str, Any]
    token_cost_estimate: dict[str, Any]


class RankingResponse(BaseModel):
    severity: str
    ranked_hospitals: List[dict]


class HealthResponse(BaseModel):
    status: str


class FacilityLookupResponse(BaseModel):
    place_id: str
    name: str
    facility_type: str
    address: str | None = None
    phone: str | None = None
    specialties: List[str] = Field(default_factory=list)
    is_247: bool = False
    distance_km: float | None = None
    eta_minutes: int | None = None
    directions_url: str


class EmergencyContactResponse(BaseModel):
    id: str
    user_id: str
    name: str
    phone: str
    relation: str | None = None
    is_primary: bool = False
    created_at: str | None = None


class SOSResponse(BaseModel):
    sos_id: str
    status: str
    contacts_alerted: int
    nearest_facility: dict[str, Any]
    message: str


class SOSCancelResponse(BaseModel):
    sos_id: str
    status: str
    message: str