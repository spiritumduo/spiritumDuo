import json
from typing import List
import pytest
from hamcrest import (
    assert_that, equal_to, none, is_,
    contains_string, not_none, not_
)
from models import UserPathway, MDT, OnMdt
from datetime import datetime, timedelta


@pytest.fixture
def update_on_mdt_query() -> str:
    return """
        mutation updateOnMdt(
            $id: ID!
            $reason: String!
            $outcome: String
            $actioned: Boolean!
        ){
            updateOnMdt(input: {
                id: $id
                reason: $reason
                outcome: $outcome
                actioned: $actioned
            }){
                onMdt{
                    reason
                    outcome
                    actioned
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


async def test_update_on_mdt_without_lock(
    on_mdt_update_permission,
    update_on_mdt_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = test_on_mdts[1]

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    ACTIONED = True

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_query,
            "variables": {
                "id": on_mdt_to_update.id,
                "reason": NEW_REASON,
                "outcome": NEW_OUTCOME,
                "actioned": ACTIONED
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(
        res.text
    )['data']['updateOnMdt']

    """
    Then: We get a success indicator returned
    """
    assert_that(
        result['onMdt'],
        is_(none())
    )
    assert_that(
        result['userErrors'],
        is_(not_none())
    )


async def test_update_on_mdt_with_lock(
    on_mdt_update_permission,
    update_on_mdt_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = test_on_mdts[1]

    await on_mdt_to_update.update(
        lock_user_id=test_user.user.id,
        lock_end_time=datetime.now() + timedelta(minutes=10)
    ).apply()

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    ACTIONED = True

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_query,
            "variables": {
                "id": on_mdt_to_update.id,
                "reason": NEW_REASON,
                "outcome": NEW_OUTCOME,
                "actioned": ACTIONED
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(
        res.text
    )['data']['updateOnMdt']

    """
    Then: We get a success indicator returned
    """
    assert_that(
        result['onMdt'],
        is_(not_none())
    )
    assert_that(
        result['onMdt']['reason'],
        is_(equal_to(NEW_REASON))
    )
    assert_that(
        result['onMdt']['outcome'],
        is_(equal_to(NEW_OUTCOME))
    )
    assert_that(
        result['userErrors'],
        is_(none())
    )

    on_mdt_check = await OnMdt.get(on_mdt_to_update.id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(NEW_REASON)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(NEW_OUTCOME)))


async def test_update_on_mdt_no_user_pathway_permission(
    on_mdt_update_permission,
    update_on_mdt_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = test_on_mdts[1]
    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    ACTIONED = True

    mdt: MDT = await MDT.get(on_mdt_to_update.mdt_id)

    await UserPathway.delete.where(
        UserPathway.pathway_id == mdt.pathway_id
    ).where(
        UserPathway.user_id == test_user.user.id
    ).gino.status()

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_query,
            "variables": {
                "id": on_mdt_to_update.id,
                "reason": NEW_REASON,
                "outcome": NEW_OUTCOME,
                "actioned": ACTIONED,
            }
        }
    )

    assert_that(res.status_code, equal_to(200))

    assert_that(
        json.loads(res.text)['data'],
        is_(none())
    )
    """
    Then: the object is not deleted
    """
    on_mdt_check = await OnMdt.get(on_mdt_to_update.id)
    assert_that(on_mdt_check.reason, is_(not_(equal_to(NEW_REASON))))
    assert_that(on_mdt_check.outcome, is_(not_(equal_to(NEW_OUTCOME))))


async def test_user_lacks_permission(
    login_user, test_client,
    update_on_mdt_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": update_on_mdt_query,
            "variables": {
                "id": "42",
                "reason": "no",
                "outcome": "brrt",
                "actioned": False
            }
        }
    )
    """
    The request should fail
    """
    payload = res.json()
    assert_that(res.status_code, equal_to(200))
    assert_that(
        payload['errors'][0]['message'],
        contains_string("Missing one or many permissions")
    )
