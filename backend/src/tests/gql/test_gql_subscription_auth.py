import datetime
import logging
from httpx import Response
from hamcrest import assert_that, equal_to
from ariadne.asgi import (
    GQL_CONNECTION_ACK,
    GQL_CONNECTION_ERROR,
    GQL_CONNECTION_INIT,
)
from models import Session
GQL_INIT = {"type": GQL_CONNECTION_INIT, "payload": {}}

"""
When we have a user in the system and we attempt a GQL subscription
"""


async def test_gql_subscription_auth_success(
    login_user: Response, test_client
):
    """
    It should attempt the subscription with a valid user
    """
    login_payload = login_user.json()
    token = login_payload["user"]["token"]
    async with test_client.websocket_connect(path="/subscription") as ws:
        await ws.send_json({
            "type": GQL_CONNECTION_INIT, "payload": {
                "token": str(token)
            }
        })
        response = await ws.receive_json()
        assert_that(response["type"], equal_to(GQL_CONNECTION_ACK))


async def test_gql_subscription_auth_missing_payload(test_client):
    """
    It should fail when the connection request is missing the auth token
    """
    async with test_client.websocket_connect("/subscription") as ws:
        await ws.send_json({"type": GQL_CONNECTION_INIT})
        response = await ws.receive_json()
        logging.warning(response)
        assert_that(
            response["payload"]["message"],
            equal_to("Invalid payload")
        )
        assert_that(response["type"], equal_to(GQL_CONNECTION_ERROR))


async def test_gql_subscription_auth_invalid_payload(test_client):
    """
    It should fail when the auth token is invalid
    """
    async with test_client.websocket_connect("/subscription") as ws:
        await ws.send_json(
            {
                "type": GQL_CONNECTION_INIT,
                "payload": {"invalid": "thing"}
            }
        )
        response = await ws.receive_json()
        logging.warning(response)
        assert_that(response["payload"]["message"], equal_to("Missing auth"))
        assert_that(response["type"], equal_to(GQL_CONNECTION_ERROR))


async def test_gql_subscription_auth_invalid_token(test_client):
    """
    It should fail when the auth token is invalid
    """
    async with test_client.websocket_connect("/subscription") as ws:
        await ws.send_json(
            {
                "type": GQL_CONNECTION_INIT,
                "payload": {"token": "invalid"}
            }
        )
        response = await ws.receive_json()
        assert_that(response["payload"]["message"], equal_to("Invalid token"))
        assert_that(response["type"], equal_to(GQL_CONNECTION_ERROR))


async def test_gql_subscription_auth_expired_session(test_client, login_user):
    """
    It should fail when the session has expired
    """
    login_payload = login_user.json()
    token = login_payload["user"]["token"]
    session = await Session.query.where(
        Session.session_key == token).gino.one_or_none()
    await session.update(expiry=datetime.datetime.utcfromtimestamp(0)).apply()
    async with test_client.websocket_connect("/subscription") as ws:
        await ws.send_json({
            "type": GQL_CONNECTION_INIT, "payload": {
                "token": str(token)
            }
        })
        response = await ws.receive_json()
        logging.warning(response)
        assert response["type"] == GQL_CONNECTION_ERROR
