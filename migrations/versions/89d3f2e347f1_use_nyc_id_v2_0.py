"""Use NYC.ID v2.0

Revision ID: 89d3f2e347f1
Revises: a3d80d04b0f1
Create Date: 2018-12-26 21:25:03.740684

"""

# revision identifiers, used by Alembic.
revision = '89d3f2e347f1'
down_revision = 'a3d80d04b0f1'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'users', ['guid'])
    # op.drop_constraint('agency_users_user_guid_fkey', 'agency_users', type_='foreignkey')
    # op.create_foreign_key(None, 'agency_users', 'users', ['user_guid'], ['guid'])
    op.drop_column('agency_users', 'auth_user_type')
    op.create_foreign_key(None, 'agency_users', 'users', ['user_guid'], ['guid'], onupdate='CASCADE')
    # op.drop_constraint('events_user_guid_fkey', 'events', type_='foreignkey')
    op.drop_column('events', 'auth_user_type')
    op.create_foreign_key(None, 'events', 'users', ['user_guid'], ['guid'], onupdate='CASCADE')
    # op.drop_constraint('user_requests_user_guid_fkey', 'user_requests', type_='foreignkey')
    op.drop_column('user_requests', 'auth_user_type')
    op.create_foreign_key(None, 'user_requests', 'users', ['user_guid'], ['guid'], onupdate='CASCADE')
    op.add_column('users', sa.Column('active', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('has_nyc_account', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('is_anonymous_requester', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('is_nyc_employee', sa.Boolean(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('auth_user_type', postgresql.ENUM('Saml2In:NYC Employees', 'LDAP:NYC Employees', 'FacebookSSO', 'MSLiveSSO', 'YahooSSO', 'LinkedInSSO', 'GoogleSSO', 'EDIRSSO', 'AnonymousUser', name='auth_user_type'), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'is_nyc_employee')
    op.drop_column('users', 'is_anonymous_requester')
    op.drop_column('users', 'has_nyc_account')
    op.drop_column('users', 'active')
    op.add_column('user_requests', sa.Column('auth_user_type', postgresql.ENUM('Saml2In:NYC Employees', 'LDAP:NYC Employees', 'FacebookSSO', 'MSLiveSSO', 'YahooSSO', 'LinkedInSSO', 'GoogleSSO', 'EDIRSSO', 'AnonymousUser', name='auth_user_type'), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'user_requests', type_='foreignkey')
    op.create_foreign_key('user_requests_user_guid_fkey', 'user_requests', 'users', ['user_guid', 'auth_user_type'], ['guid', 'auth_user_type'], onupdate='CASCADE')
    op.add_column('events', sa.Column('auth_user_type', postgresql.ENUM('Saml2In:NYC Employees', 'LDAP:NYC Employees', 'FacebookSSO', 'MSLiveSSO', 'YahooSSO', 'LinkedInSSO', 'GoogleSSO', 'EDIRSSO', 'AnonymousUser', name='auth_user_type'), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'events', type_='foreignkey')
    op.create_foreign_key('events_user_guid_fkey', 'events', 'users', ['user_guid', 'auth_user_type'], ['guid', 'auth_user_type'], onupdate='CASCADE')
    op.add_column('agency_users', sa.Column('auth_user_type', postgresql.ENUM('Saml2In:NYC Employees', 'LDAP:NYC Employees', 'FacebookSSO', 'MSLiveSSO', 'YahooSSO', 'LinkedInSSO', 'GoogleSSO', 'EDIRSSO', 'AnonymousUser', name='auth_user_type'), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'agency_users', type_='foreignkey')
    op.create_foreign_key('agency_users_user_guid_fkey', 'agency_users', 'users', ['user_guid', 'auth_user_type'], ['guid', 'auth_user_type'], onupdate='CASCADE')
    ### end Alembic commands ###
