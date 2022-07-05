import pytest
import asyncio
from httpx import Response
from hamcrest import assert_that, equal_to, contains_string
from ariadne.asgi import (
    GQL_CONNECTION_INIT,
    GQL_START
)


@pytest.fixture
def clinical_request_resolved_query() -> dict:
    return {
        "type": GQL_START,
        "payload": {
            "query": """subscription clinicalRequestResolved {
                    clinicalRequestResolved {
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


async def test_clinical_request_resolved(
        subscription_ws, test_sdpubsub,
        clinical_request_read_permission,
        clinical_request_resolved_query
):
    """
    It should return the clinical_request with a valid user
    """
    await subscription_ws.send_json(clinical_request_resolved_query)
    TEST_MILESTONE = {
        "id": '1'
    }
    receive_task = asyncio.create_task(subscription_ws.receive_json())
    await asyncio.sleep(0.01)  # advance the event loop
    asyncio.create_task(
        test_sdpubsub.publish(
            "clinicalRequest-resolutions",
            TEST_MILESTONE
        )
    )
    res = await receive_task
    assert_that(
        res['payload']['data']['clinicalRequestResolved'],
        equal_to(TEST_MILESTONE)
    )


async def test_clinical_request_resolved_invalid_permissions(
    subscription_ws, clinical_request_resolved_query
):
    await subscription_ws.send_json(clinical_request_resolved_query)
    res = await subscription_ws.receive_json()
    assert_that(
        res['payload']['message'],
        contains_string("Missing one or many permissions")
    )
