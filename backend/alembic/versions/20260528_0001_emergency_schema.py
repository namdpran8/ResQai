from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from app.db.models import GeographyPoint


GEN_RANDOM_UUID_SQL = sa.text("gen_random_uuid()")


# revision identifiers, used by Alembic.
revision = "20260528_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
	op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
	op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

	op.create_table(
		"facilities",
		sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL),
		sa.Column("place_id", sa.String(length=255), nullable=False, unique=True),
		sa.Column("name", sa.String(length=255), nullable=False),
		sa.Column("facility_type", sa.String(length=50), nullable=False),
		sa.Column("address", sa.Text(), nullable=True),
		sa.Column("phone", sa.String(length=50), nullable=True),
		sa.Column("latitude", sa.DECIMAL(10, 8), nullable=False),
		sa.Column("longitude", sa.DECIMAL(11, 8), nullable=False),
		sa.Column("location", GeographyPoint(), nullable=True),
		sa.Column("specialties", postgresql.ARRAY(sa.String()), nullable=True),
		sa.Column("is_247", sa.Boolean(), nullable=False, server_default=sa.text("false")),
		sa.Column("verified_at", sa.DateTime(), nullable=True),
		sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
	)
	op.create_index("idx_facilities_location", "facilities", ["location"], postgresql_using="gist")

	op.create_table(
		"emergency_contacts",
		sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL),
		sa.Column("user_id", sa.String(length=255), nullable=False),
		sa.Column("name", sa.String(length=100), nullable=False),
		sa.Column("phone", sa.String(length=20), nullable=False),
		sa.Column("relation", sa.String(length=50), nullable=True),
		sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.text("false")),
		sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
	)
	op.create_index("ix_emergency_contacts_user_id", "emergency_contacts", ["user_id"])

	op.create_table(
		"sos_events",
		sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=GEN_RANDOM_UUID_SQL),
		sa.Column("user_id", sa.String(length=255), nullable=True),
		sa.Column("latitude", sa.DECIMAL(10, 8), nullable=True),
		sa.Column("longitude", sa.DECIMAL(11, 8), nullable=True),
		sa.Column("severity", sa.String(length=20), nullable=True),
		sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'initiated'")),
		sa.Column("contacts_alerted", sa.Integer(), nullable=False, server_default=sa.text("0")),
		sa.Column("facility_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("facilities.id"), nullable=True),
		sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
		sa.Column("resolved_at", sa.DateTime(), nullable=True),
	)
	op.create_index("ix_sos_events_user_id", "sos_events", ["user_id"])


def downgrade() -> None:
	op.drop_index("ix_sos_events_user_id", table_name="sos_events")
	op.drop_table("sos_events")
	op.drop_index("ix_emergency_contacts_user_id", table_name="emergency_contacts")
	op.drop_table("emergency_contacts")
	op.drop_index("idx_facilities_location", table_name="facilities")
	op.drop_table("facilities")
