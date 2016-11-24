from flask import (
    request,
    jsonify,
    render_template,
    current_app
)
from flask_login import current_user, login_user
from app import es
from app.constants import request_status
from app.search import search
from app.search.constants import DEFAULT_HITS_SIZE
from app.lib.utils import (
    eval_request_bool,
    InvalidUserException,
)

from app.search.utils import (
    search_requests,
    _process_highlights,
    _convert_dates
)


@search.route("/", methods=['GET'])
def test():
    return render_template('search/test.html')


# TODO: move what should be in utils into utils!!!

@search.route("/requests", methods=['GET'])
def requests():
    """
    For request parameters, see app.search.utils.search_requests

    Anonymous Users can search by:
    - Title (public only)
    - Agency Description (public only)

    Public Users can search by:
    - Title (public only OR public and private if user is requester)
    - Agency Description (public only)
    - Description (if user is requester)

    Agency Users can search by:
    - Title
    - Agency Description
    - Description
    - Requester Name

    All Users can filter by:
    - Status, Open
    - Status, Closed
    - Date Received
    - Agency

    Only Agency Users can filter by:
    - Status, In Progress
    - Status, Due Soon
    - Status, Overdue
    - Date Due

    """

    # from app.models import Users
    # from app.constants.user_type_auth import PUBLIC_USER_NYC_ID, AGENCY_USER
    # user = Users.query.filter_by(auth_user_type=AGENCY_USER).first()
    # login_user(user, force=True)

    try:
        agency_ein = int(request.args.get('agency_ein'))
    except ValueError:
        agency_ein = None

    try:
        size = int(request.args.get('size', DEFAULT_HITS_SIZE))
    except ValueError:
        size = DEFAULT_HITS_SIZE

    try:
        start = int(request.args.get('start'), 0)
    except ValueError:
        start = 0

    return search_requests(
        request.args.get('query'),
        eval_request_bool(request.args.get('foil_id'), False),
        eval_request_bool(request.args.get('title')),
        eval_request_bool(request.args.get('agency_description')),
        eval_request_bool(request.args.get('description')) if not current_user.is_anonymous else False,
        eval_request_bool(request.args.get('requester_name')) if current_user.is_agency else False,
        request.args.get('date_rec_from'),
        request.args.get('date_rec_to'),
        request.args.get('date_due_from'),
        request.args.get('date_due_to'),
        agency_ein,
        eval_request_bool(request.args.get('open')),
        eval_request_bool(request.args.get('closed'), False),
        eval_request_bool(request.args.get('in_progress')) if current_user.is_agency else False,
        eval_request_bool(request.args.get('due_soon')) if current_user.is_agency else False,
        eval_request_bool(request.args.get('overdue')) if current_user.is_agency else False,
        size,
        start,
        request.args.get('sort_date_submitted'),
        request.args.get('sort_date_due'),
        request.args.get('sort_title'),
        # eval_request_bool(request.args.get('by_phrase'), False),
        # eval_request_bool(request.args.get('highlight'), False),
    )
