"""empty message

Revision ID: 30da6f241071
Revises: 224ca3a28c71
Create Date: 2025-11-23 15:20:33.714779

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '30da6f241071'
down_revision = '224ca3a28c71'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if 'responses' not in inspector.get_table_names():
        op.create_table('responses',
            sa.Column('response_id', sa.Integer(), nullable=False),
            sa.Column('message', sa.Text(), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.Column('ticket', sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(['ticket'], ['tickets.ticket_id'], ),
            sa.PrimaryKeyConstraint('response_id')
        )


def downgrade():
    # Drop the responses table if it exists.
    op.execute('DROP TABLE IF EXISTS responses CASCADE')
