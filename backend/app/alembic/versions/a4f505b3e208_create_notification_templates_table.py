"""create notification templates table

Revision ID: a4f505b3e208
Revises: 656c3b1b4a98
Create Date: 2024-12-15 16:12:24.704694

"""

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql
from datetime import datetime


# revision identifiers, used by Alembic.
revision = "a4f505b3e208"
down_revision = "656c3b1b4a98"
branch_labels = None
depends_on = None


def upgrade():
    # Ensure uuid-ossp extension is available
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "notification_templates",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column(
            "title", sqlmodel.sql.sqltypes.AutoString(), nullable=False, unique=True
        ),
        sa.Column("icon", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("body", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("excerpt", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("notification_templates")
