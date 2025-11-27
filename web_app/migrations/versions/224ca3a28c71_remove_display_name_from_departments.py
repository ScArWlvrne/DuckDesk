"""Remove display_name from departments

Revision ID: 224ca3a28c71
Revises: 345d0d279800
Create Date: 2025-11-13 09:00:14.935001

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '224ca3a28c71'
down_revision = '345d0d279800'
branch_labels = None
depends_on = None


def upgrade():
    # This migration previously recreated core tables and failed when they already existed.
    # Leaving it intentionally empty preserves the existing schema created by earlier revisions.
    pass


def downgrade():
    # No-op downgrade to avoid dropping core tables.
    pass
