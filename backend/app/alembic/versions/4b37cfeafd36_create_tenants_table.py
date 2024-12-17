"""create tenants table

Revision ID: 4b37cfeafd36
Revises: a4f505b3e208
Create Date: 2024-12-15 16:26:13.900354

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql
from datetime import datetime


# revision identifiers, used by Alembic.
revision = '4b37cfeafd36'
down_revision = 'a4f505b3e208'
branch_labels = None
depends_on = None

from datetime import datetime


def upgrade():
    # Ensure uuid-ossp extension is available
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "tenants",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False, unique=True),
        sa.Column("slug", sqlmodel.sql.sqltypes.AutoString(), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("tenants")
