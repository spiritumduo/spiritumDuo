from ariadne.asgi import GraphQL
from authentication.authentication import needsAuthenticated
from .schema import schema
import logging
from models import db, Session, User
from datetime import datetime
from starlette.requests import Request
from starlette.websockets import HTTPConnection, WebSocket

from typing import Any
from ariadne.asgi import WebSocketConnectionError
from pydantic import BaseModel

log = logging.getLogger("uvicorn")


class SdWebsocketConnectionParams(BaseModel):
    token: str

async def ws_on_connect(
        websocket: WebSocket = None, params: SdWebsocketConnectionParams = None
):
    if not isinstance(params, dict):
        raise WebSocketConnectionError("Invalid payload")

    token = params.get("token")
    if not token:
        raise WebSocketConnectionError("Missing auth")

    async with db.acquire(reuse=False) as conn:
        session = db.select([User, Session]).where(
            Session.session_key == token
        ).where(
            Session.user_id == User.id
        ).where(
            Session.expiry > datetime.now()
        ).where(
            User.is_active == True
        )
        user = await conn.one_or_none(session)

        if user is None:
            raise WebSocketConnectionError("Invalid token")

        websocket.scope["user"] = user


def get_context_values(request: HTTPConnection):
    context = {}

    if request.scope["type"] == "websocket":
        context["user"] = request.scope["user"]

    context['request'] = request
    context['db'] = db
    return context


_graphql = GraphQL(
    schema=schema,
    debug=True,
    context_value=get_context_values
)


@needsAuthenticated
def graphql(request: Request):
    return _graphql


def ws_graphql():
    return GraphQL(
        schema=schema,
        debug=True,
        on_connect=ws_on_connect,
        context_value=get_context_values
    )
