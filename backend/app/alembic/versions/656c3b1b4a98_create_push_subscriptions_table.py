"""create push subscriptions table

Revision ID: 656c3b1b4a98
Revises: bd8358be9509
Create Date: 2024-12-08 10:43:50.122854

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

from datetime import datetime

# revision identifiers, used by Alembic.
revision = '656c3b1b4a98'
down_revision = 'bd8358be9509'
branch_labels = None
depends_on = None


def upgrade():
    # Ensure uuid-ossp extension is available
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "push_subscriptions",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column(
            "endpoint", sqlmodel.sql.sqltypes.AutoString(), nullable=False, unique=True
        ),
        sa.Column("p256dh", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("auth", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("group", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_push_subscriptions_endpoint"), "push_subscriptions", ["endpoint"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_push_subscriptions_endpoint"), table_name="push_subscriptions")
    op.drop_table("push_subscriptions")
