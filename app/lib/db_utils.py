"""
    app.lib.db_utils
    ~~~~~~~~~~~~~~~~
    synopsis: Handles the functions for database control
"""
import json

from sqlalchemy.orm.attributes import flag_modified
from app import db

# TODO: Add comment explaining why this is needed
from app.models import Agencies, Users, Requests


def create_object(obj):
    """
    :param obj: Object class being created in database
    :return: Adding and committing object to database
    """
    try:
        db.session.add(obj)
        db.session.commit()
        return str(obj)
    except Exception as e:
        # TODO: email str(e)
        db.session.rollback()
        return None


def update_object(attribute, value, obj_type, obj_id):
    """

    :param attribute:
    :param value:
    :param obj_type:
    :param obj_id:
    :return:
    """
    obj = get_obj(obj_type, obj_id)

    if obj:
        try:
            if type(value) == type(dict):
                flag_modified(obj, attribute)
            setattr(obj, attribute, value)
            db.session.commit()
            return str(obj)
        except Exception:
            db.session.rollback()
            return None

    return None


def get_obj(obj_type, obj_id):
    """

    :param obj_type:
    :param obj_id:
    :return:
    """
    if not obj_id:
        return None
    return eval(obj_type).query.get(obj_id)


def get_agencies_list():
    agencies = sorted([(agencies.ein, agencies.name) for agencies in db.session.query(Agencies).all()],
                      key=lambda x: x[1])
    agencies.insert(0, ('', ''))

    return agencies


def date_deserialize(obj):
    """
    Function that deserializes datetime objects into a JSON object

    :param obj: date object being deserialized
    :return: date object deserialized as a JSON object
    """
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError
