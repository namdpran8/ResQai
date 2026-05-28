from typing import List

from pydantic import BaseModel, Field, field_validator

from app.utils.validators import validate_e164_phone


class TriageRequest(BaseModel):
    description: str = Field(..., min_length=1, max_length=500)
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)

    @field_validator("description")
    @classmethod
    def strip_description(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("description cannot be empty")
        return value


class HospitalRankingRequest(BaseModel):
    hospitals: List[dict] = Field(default_factory=list)


class EmergencyContactCreateRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=255)
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=1, max_length=20)
    relation: str | None = Field(default=None, max_length=50)
    is_primary: bool = False

    @field_validator("user_id", "name", "relation")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        return text or None

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: str) -> str:
        return validate_e164_phone(value)


class SOSRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    user_id: str = Field(..., min_length=1, max_length=255)
    severity: str = Field(default="unknown", max_length=20)

    @field_validator("user_id", "severity")
    @classmethod
    def strip_text(cls, value: str) -> str:
        text = value.strip()
        return text or "unknown"