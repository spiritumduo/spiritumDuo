import json
import sys
from typing import List
import pytest
from hamcrest import (
    assert_that, equal_to, none, is_,
    contains_string, not_none, not_
)
from models import UserPathway, MDT, OnMdt
from datetime import datetime, timedelta


@pytest.fixture
def update_on_mdt_list_query() -> str:
    return """
        mutation updateOnMdtList($input: UpdateOnMdtListInput!){
            updateOnMdtList(input: $input){
                onMdtList{
                    reason
                    outcome
                    order
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


async def test_update_on_mdt_list_without_lock(
    on_mdt_update_permission,
    update_on_mdt_list_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):

    on_mdt_to_update = [test_on_mdts[1], test_on_mdts[3], test_on_mdts[6]]

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    NEW_ORDER_0 = 20
    NEW_ORDER_1 = 21
    NEW_ORDER_2 = 22

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_list_query,
            "variables": {
                "input": {
                    "onMdtList": [
                        {
                            "id": on_mdt_to_update[0].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_0,
                        },
                        {
                            "id": on_mdt_to_update[1].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_1,
                        },
                        {
                            "id": on_mdt_to_update[2].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                    ],
                },
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(
        res.text
    )

    """
    Then: We get a success indicator returned
    """
    assert_that(
        result['data'],
        is_(none())
    )
    assert_that(
        result['errors'],
        is_(not_none())
    )


async def test_update_on_mdt_list_with_lock(
    on_mdt_update_permission,
    update_on_mdt_list_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = [test_on_mdts[1], test_on_mdts[3], test_on_mdts[6]]

    for on_mdt in on_mdt_to_update:
        await on_mdt.update(
            lock_user_id=test_user.user.id,
            lock_end_time=datetime.now() + timedelta(minutes=10)
        ).apply()

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    NEW_ORDER_0 = 20
    NEW_ORDER_1 = 21
    NEW_ORDER_2 = 22

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_list_query,
            "variables": {
                "input": {
                    "onMdtList": [
                        {
                            "id": on_mdt_to_update[0].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_0,
                        },
                        {
                            "id": on_mdt_to_update[1].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_1,
                        },
                        {
                            "id": on_mdt_to_update[2].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                    ],
                },
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(
        res.text
    )['data']['updateOnMdtList']

    """
    Then: We get a success indicator returned
    """
    assert_that(
        result['onMdtList'],
        is_(not_none())
    )
    assert_that(
        result['onMdtList'][0]['reason'],
        is_(equal_to(NEW_REASON))
    )
    assert_that(
        result['onMdtList'][0]['outcome'],
        is_(equal_to(NEW_OUTCOME))
    )
    assert_that(
        result['onMdtList'][0]['order'],
        is_(equal_to(NEW_ORDER_0))
    )
    assert_that(
        result['userErrors'],
        is_(none())
    )

    assert_that(
        result['onMdtList'],
        is_(not_none())
    )
    assert_that(
        result['onMdtList'][1]['reason'],
        is_(equal_to(NEW_REASON))
    )
    assert_that(
        result['onMdtList'][1]['outcome'],
        is_(equal_to(NEW_OUTCOME))
    )
    assert_that(
        result['onMdtList'][1]['order'],
        is_(equal_to(NEW_ORDER_1))
    )
    assert_that(
        result['userErrors'],
        is_(none())
    )

    assert_that(
        result['onMdtList'],
        is_(not_none())
    )
    assert_that(
        result['onMdtList'][2]['reason'],
        is_(equal_to(NEW_REASON))
    )
    assert_that(
        result['onMdtList'][2]['outcome'],
        is_(equal_to(NEW_OUTCOME))
    )
    assert_that(
        result['onMdtList'][2]['order'],
        is_(equal_to(NEW_ORDER_2))
    )
    assert_that(
        result['userErrors'],
        is_(none())
    )

    on_mdt_check = await OnMdt.get(on_mdt_to_update[0].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(NEW_REASON)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(NEW_OUTCOME)))
    assert_that(
        on_mdt_check.order, is_(equal_to(NEW_ORDER_0)))

    on_mdt_check = await OnMdt.get(on_mdt_to_update[1].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(NEW_REASON)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(NEW_OUTCOME)))
    assert_that(
        on_mdt_check.order, is_(equal_to(NEW_ORDER_1)))

    on_mdt_check = await OnMdt.get(on_mdt_to_update[2].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(NEW_REASON)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(NEW_OUTCOME)))
    assert_that(
        on_mdt_check.order, is_(equal_to(NEW_ORDER_2)))


async def test_update_on_mdt_list_transaction_rollback_system_exception(
    on_mdt_update_permission,
    update_on_mdt_list_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = [test_on_mdts[1], test_on_mdts[3], test_on_mdts[6]]

    for on_mdt in on_mdt_to_update:
        await on_mdt.update(
            lock_user_id=test_user.user.id,
            lock_end_time=datetime.now() + timedelta(minutes=10)
        ).apply()

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    NEW_ORDER_0 = 20
    NEW_ORDER_1 = 21
    NEW_ORDER_2 = 22

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": update_on_mdt_list_query,
            "variables": {
                "input": {
                    "onMdtList": [
                        {
                            "id": on_mdt_to_update[0].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_0,
                        },
                        {
                            "id": on_mdt_to_update[1].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_1,
                        },
                        {
                            "id": on_mdt_to_update[2].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                        {
                            "id": 2000000000,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                    ],
                },
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(res.text)

    """
    Then: We get an error
    """
    assert_that(
        result['data'],
        is_(none())
    )
    assert_that(
        result['errors'],
        is_(not_none())
    )

    on_mdt_check = await OnMdt.get(on_mdt_to_update[0].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(on_mdt_to_update[0].reason)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(on_mdt_to_update[0].outcome)))
    assert_that(
        on_mdt_check.order, is_(equal_to(on_mdt_to_update[0].order)))

    on_mdt_check = await OnMdt.get(on_mdt_to_update[1].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(on_mdt_to_update[1].reason)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(on_mdt_to_update[1].outcome)))
    assert_that(
        on_mdt_check.order, is_(equal_to(on_mdt_to_update[1].order)))

    on_mdt_check = await OnMdt.get(on_mdt_to_update[2].id)
    assert_that(
        on_mdt_check.reason, is_(equal_to(on_mdt_to_update[2].reason)))
    assert_that(
        on_mdt_check.outcome, is_(equal_to(on_mdt_to_update[2].outcome)))
    assert_that(
        on_mdt_check.order, is_(equal_to(on_mdt_to_update[2].order)))


async def test_update_on_mdt_list_no_user_pathway_permission(
    on_mdt_update_permission,
    update_on_mdt_list_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_update = [test_on_mdts[1], test_on_mdts[3], test_on_mdts[6]]
    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    NEW_ORDER_0 = 20
    NEW_ORDER_1 = 21
    NEW_ORDER_2 = 22

    mdt: MDT = await MDT.get(on_mdt_to_update[0].mdt_id)

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
            "query": update_on_mdt_list_query,
            "variables": {
                "input": {
                    "onMdtList": [
                        {
                            "id": on_mdt_to_update[0].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_0,
                        },
                        {
                            "id": on_mdt_to_update[1].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_1,
                        },
                        {
                            "id": on_mdt_to_update[2].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                    ],
                },
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
    on_mdt_check = await OnMdt.get(on_mdt_to_update[0].id)
    assert_that(on_mdt_check.reason, is_(not_(equal_to(NEW_REASON))))
    assert_that(on_mdt_check.outcome, is_(not_(equal_to(NEW_OUTCOME))))


async def test_user_lacks_permission(
    login_user, test_client, test_on_mdts: List[OnMdt],
    update_on_mdt_list_query
):
    """
    Given the user's test role lacks the required permission
    """
    on_mdt_to_update = [test_on_mdts[1], test_on_mdts[3], test_on_mdts[6]]

    NEW_REASON = 'test reason go brrt'
    NEW_OUTCOME = 'test outcome go brrt'
    NEW_ORDER_0 = 20
    NEW_ORDER_1 = 21
    NEW_ORDER_2 = 22
    res = await test_client.post(
        path="/graphql",
        json={
            "query": update_on_mdt_list_query,
            "variables": {
                "input": {
                    "onMdtList": [
                        {
                            "id": on_mdt_to_update[0].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_0,
                        },
                        {
                            "id": on_mdt_to_update[1].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_1,
                        },
                        {
                            "id": on_mdt_to_update[2].id,
                            "reason": NEW_REASON,
                            "outcome": NEW_OUTCOME,
                            "order": NEW_ORDER_2,
                        },
                    ],
                },
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
