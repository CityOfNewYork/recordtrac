"""Adding AgencyUsers

Revision ID: 52a4062502bb
Revises: 971f341c0204
Create Date: 2017-05-25 19:28:31.144382

"""

# revision identifiers, used by Alembic.
revision = '52a4062502bb'
down_revision = '971f341c0204'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('agency_users',
                    sa.Column('user_guid', sa.String(length=64), nullable=False),
                    sa.Column('auth_user_type',
                              sa.Enum('Saml2In:NYC Employees', 'LDAP:NYC Employees', 'FacebookSSO', 'MSLiveSSO',
                                      'YahooSSO', 'LinkedInSSO', 'GoogleSSO', 'EDIRSSO', 'AnonymousUser',
                                      name='auth_user_type'), nullable=False),
                    sa.Column('agency_ein', sa.String(length=4), nullable=False),
                    sa.Column('is_agency_active', sa.Boolean(), nullable=False),
                    sa.Column('is_agency_admin', sa.Boolean(), nullable=False),
                    sa.Column('is_primary_agency', sa.Boolean(), nullable=False),
                    sa.ForeignKeyConstraint(['agency_ein'], ['agencies.ein'], ),
                    sa.ForeignKeyConstraint(['user_guid', 'auth_user_type'], ['users.guid', 'users.auth_user_type'],
                                            onupdate='CASCADE'),
                    sa.PrimaryKeyConstraint('user_guid', 'auth_user_type', 'agency_ein')
                    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('agency_users')
    ### end Alembic commands ###
