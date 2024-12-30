"""create drafts table

Revision ID: bd8358be9509
Revises: c0eeb56e8ce0
Create Date: 2024-11-15 16:17:20.198895

"""

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

from datetime import datetime


# revision identifiers, used by Alembic.
revision = "bd8358be9509"
down_revision = "c0eeb56e8ce0"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "drafts",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("content", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("image_url", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("link_url", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("platform", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("is_published", sa.Boolean(), default=False),
        sa.Column("scheduled_time", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("drafts")
