import json
from typing import List
import pytest
from hamcrest import (
    assert_that, equal_to, none, is_,
    contains_string, not_none
)
from models import UserPathway, MDT, OnMdt


@pytest.fixture
def delete_on_mdt_query() -> str:
    return """
        mutation deleteOnMdt(
            $id: ID!
        ){
            deleteOnMdt(id: $id){
                success
                userErrors{
                    field
                    message
                }
            }
        }
    """


async def test_delete_on_mdt(
    on_mdt_delete_permission,
    delete_on_mdt_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_remove = test_on_mdts[1]

    """
    When: we execute the query to delete an onmdt record
    """
    res = await httpx_test_client.post(
        url="graphql",
        json={
            "query": delete_on_mdt_query,
            "variables": {
                "id": on_mdt_to_remove.id,
            }
        }
    )

    assert_that(res.status_code, equal_to(200))
    result = json.loads(
        res.text
    )['data']['deleteOnMdt']

    """
    Then: We get a success indicator returned
    """
    assert_that(
        result['success'],
        equal_to(True)
    )
    assert_that(
        result['userErrors'],
        is_(none())
    )

    on_mdt_check = await OnMdt.get(on_mdt_to_remove.id)
    assert_that(on_mdt_check, is_(none()))


async def test_delete_on_mdt_no_user_pathway_permission(
    on_mdt_delete_permission,
    delete_on_mdt_query,
    httpx_test_client, httpx_login_user,
    test_on_mdts: List[OnMdt], test_user
):
    on_mdt_to_remove = test_on_mdts[1]

    mdt: MDT = await MDT.get(on_mdt_to_remove.mdt_id)

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
            "query": delete_on_mdt_query,
            "variables": {
                "id": on_mdt_to_remove.id,
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
    on_mdt_check = await OnMdt.get(on_mdt_to_remove.id)
    assert_that(on_mdt_check, is_(not_none()))


async def test_user_lacks_permission(
    login_user, test_client,
    delete_on_mdt_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": delete_on_mdt_query,
            "variables": {
                "id": "42",
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
