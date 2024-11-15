"""create tweets table

Revision ID: c0eeb56e8ce0
Revises: 1a31ce608336
Create Date: 2024-11-15 13:33:15.643332

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql

from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'c0eeb56e8ce0'
down_revision = '1a31ce608336'
branch_labels = None
depends_on = None


def upgrade():
    # Ensure uuid-ossp extension is available
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "tweets",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column("content", sqlmodel.sql.sqltypes.AutoString(), nullable=False, unique=True),
        sa.Column("twitter_id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_tweets_twitter_id"), "tweets", ["twitter_id"], unique=True)


def downgrade():
    op.drop_index(op.f("ix_tweets_twitter_id"), table_name="tweets")
    op.drop_table("tweets")
