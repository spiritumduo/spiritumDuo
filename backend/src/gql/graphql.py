from ariadne.asgi import GraphQL
from authentication.authentication import needsAuthenticated
from .schema import schema
from models import db
from starlette.requests import HTTPConnection, Request


def get_context_values(request: HTTPConnection):
    return{
        "request": request,
        "db": db
    }


_graphql = GraphQL(
    schema=schema,
    debug=True,
    context_value=get_context_values
)


@needsAuthenticated
def graphql(request: Request):
    return _graphql
