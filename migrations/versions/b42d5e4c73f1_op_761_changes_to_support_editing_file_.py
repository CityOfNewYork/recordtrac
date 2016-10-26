"""OP-761: Changes to support editing file upload responses

Revision ID: b42d5e4c73f1
Revises: 4132ccc4d149
Create Date: 2016-10-26 13:25:49.017068

"""

# revision identifiers, used by Alembic.
revision = 'b42d5e4c73f1'
down_revision = '4132ccc4d149'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('metadatas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.Enum('notes', 'links', 'files', 'instructions', 'extensions', 'emails', name='metadata_type'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('emails', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'emails', 'metadatas', ['id'], ['id'])
    op.drop_column('emails', 'metadata_id')
    op.add_column('extensions', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'extensions', 'metadatas', ['id'], ['id'])
    op.drop_column('extensions', 'metadata_id')
    op.add_column('files', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'files', 'metadatas', ['id'], ['id'])
    op.drop_column('files', 'metadata_id')
    op.add_column('instructions', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'instructions', 'metadatas', ['id'], ['id'])
    op.drop_column('instructions', 'metadata_id')
    op.add_column('links', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'links', 'metadatas', ['id'], ['id'])
    op.drop_column('links', 'metadata_id')
    op.add_column('notes', sa.Column('id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'notes', 'metadatas', ['id'], ['id'])
    op.drop_column('notes', 'metadata_id')
    op.alter_column('responses', 'metadata_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.create_foreign_key(None, 'responses', 'metadatas', ['metadata_id'], ['id'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'responses', type_='foreignkey')
    op.alter_column('responses', 'metadata_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.add_column('notes', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'notes', type_='foreignkey')
    op.drop_column('notes', 'id')
    op.add_column('links', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'links', type_='foreignkey')
    op.drop_column('links', 'id')
    op.add_column('instructions', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'instructions', type_='foreignkey')
    op.drop_column('instructions', 'id')
    op.add_column('files', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'files', type_='foreignkey')
    op.drop_column('files', 'id')
    op.add_column('extensions', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'extensions', type_='foreignkey')
    op.drop_column('extensions', 'id')
    op.add_column('emails', sa.Column('metadata_id', sa.INTEGER(), nullable=False))
    op.drop_constraint(None, 'emails', type_='foreignkey')
    op.drop_column('emails', 'id')
    op.drop_table('metadatas')
    ### end Alembic commands ###
