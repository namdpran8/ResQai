from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import DATABASE_URL


engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True) if DATABASE_URL else None
SessionLocal = (
	sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False, future=True)
	if engine is not None
	else None
)


def get_db() -> Generator[Session | None, None, None]:
	if SessionLocal is None:
		yield None
		return

	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()