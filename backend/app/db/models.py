from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, DECIMAL, ForeignKey, Index, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.types import UserDefinedType


GEN_RANDOM_UUID_SQL = text("gen_random_uuid()")


class Base(DeclarativeBase):
	pass


class GeographyPoint(UserDefinedType):
	cache_ok = True

	def get_col_spec(self, **kw: object) -> str:
		return "GEOGRAPHY(POINT, 4326)"


class Facility(Base):
	__tablename__ = "facilities"

	id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL)
	place_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
	name: Mapped[str] = mapped_column(String(255), nullable=False)
	facility_type: Mapped[str] = mapped_column(String(50), nullable=False)
	address: Mapped[str | None] = mapped_column(Text, nullable=True)
	phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
	latitude: Mapped[float] = mapped_column(DECIMAL(10, 8), nullable=False)
	longitude: Mapped[float] = mapped_column(DECIMAL(11, 8), nullable=False)
	location: Mapped[str | None] = mapped_column(GeographyPoint(), nullable=True)
	specialties: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
	is_247: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
	verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
	created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=False, server_default=func.now())

	emergency_events: Mapped[list["SOSEvent"]] = relationship(back_populates="facility")

	__table_args__ = (
		Index("idx_facilities_location", "location", postgresql_using="gist"),
	)


class EmergencyContact(Base):
	__tablename__ = "emergency_contacts"

	id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL)
	user_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
	name: Mapped[str] = mapped_column(String(100), nullable=False)
	phone: Mapped[str] = mapped_column(String(20), nullable=False)
	relation: Mapped[str | None] = mapped_column(String(50), nullable=True)
	is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
	created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=False, server_default=func.now())


class SOSEvent(Base):
	__tablename__ = "sos_events"

	id: Mapped[uuid.UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL)
	user_id: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
	latitude: Mapped[float | None] = mapped_column(DECIMAL(10, 8), nullable=True)
	longitude: Mapped[float | None] = mapped_column(DECIMAL(11, 8), nullable=True)
	severity: Mapped[str | None] = mapped_column(String(20), nullable=True)
	status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'initiated'"))
	contacts_alerted: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))
	facility_id: Mapped[uuid.UUID | None] = mapped_column(PG_UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=True)
	created_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=False, server_default=func.now())
	resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

	facility: Mapped[Facility | None] = relationship(back_populates="emergency_events")