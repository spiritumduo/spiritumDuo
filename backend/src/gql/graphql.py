from ariadne.asgi import GraphQL
from starlette.responses import Response
from .schema import schema
from models import db
from starlette.requests import HTTPConnection
from config import config

def get_context_values(request:HTTPConnection):
    return{
        "request":request,
        "db":db
    }

_graphql=GraphQL(
    schema=schema, 
    debug=True, 
    context_value=get_context_values
)

def graphql(request:HTTPConnection):
    if ("DEBUG_DISABLE_PERMISSION_CHECKING" in config) and (config["DEBUG_DISABLE_PERMISSION_CHECKING"]==True):
        return _graphql

    if "authenticated" in request.auth.scopes:
        return _graphql
    else:
        """
        we'll return HTTP 401 here because the
        user is lacking authentication credentials
        (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
        """
        return Response(status_code=401)
        