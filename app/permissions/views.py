from flask import jsonify
from app.permissions import permissions
from app.models import Roles
from app.constants import permission
from app.permissions.utils import has_permission


@permissions.route('/<role>', methods=['GET'])
def get_role_permissions(role):
    """
    Given a role, return the permissions that are in that role.

    :param role:
    :return:
    """
    role = Roles.query.filter_by(id=role).one()
    role_permissions = []

    for i, perm in enumerate(permission.ALL):
        if has_permission(role, perm.value):
            role_permissions.append(i)

    return jsonify(role_permissions), 200
