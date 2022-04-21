import logging

import pytest

from sdpubsub import SdPubSub
import asyncio
from httpx import Response
from hamcrest import assert_that, equal_to, contains_string
from ariadne.asgi import (
    GQL_CONNECTION_ACK,
    GQL_CONNECTION_INIT,
    GQL_START
)


@pytest.fixture
def milestone_resolved_query() -> dict:
    return {
        "type": GQL_START,
        "payload": {
            "query": """subscription milestoneResolved {
                    milestoneResolved {
                        id
                    }
                }"""
        }
    }


@pytest.fixture
async def subscription_ws(login_user: Response, test_client):
    login_payload = login_user.json()
    token = login_payload["user"]["token"]
    async with test_client.websocket_connect(path="/subscription") as ws:
        await ws.send_json({
            "type": GQL_CONNECTION_INIT, "payload": {
                "token": str(token)
            }
        })
        await ws.receive_json()
        yield ws


async def test_milestone_resolved(
        subscription_ws, test_sdpubsub, milestone_read_permission, milestone_resolved_query
):
    """
    It should return the milestone with a valid user
    """
    await subscription_ws.send_json(milestone_resolved_query)
    TEST_MILESTONE = {
        "id": '1'
    }
    receive_task = asyncio.create_task(subscription_ws.receive_json())
    await asyncio.sleep(0.01)  # advance the event loop
    asyncio.create_task(test_sdpubsub.publish("milestone-resolutions", TEST_MILESTONE))
    res = await receive_task
    assert_that(res['payload']['data']['milestoneResolved'], equal_to(TEST_MILESTONE))


async def test_milestone_resolved_invalid_permissions(subscription_ws, milestone_resolved_query):
    await subscription_ws.send_json(milestone_resolved_query)
    res = await subscription_ws.receive_json()
    assert_that(res['payload']['message'], contains_string("Missing one or many permissions"))
