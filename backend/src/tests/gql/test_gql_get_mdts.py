import json
import pytest
from models import MDT
from datetime import datetime
from hamcrest import assert_that, equal_to, has_length, contains_string


@pytest.fixture
def get_mdts_query() -> str:
    return """
        query getMdts(
            $pathwayId: ID!,
            $includePast: Boolean = false
        ){
            getMdts(
                pathwayId: $pathwayId,
                includePast: $includePast
            ){
                id
            }
        }
    """


# Feature: Test user REST/GQL operations
# Scenario: we need future and current mdts on this pathway
async def test_gql_get_mdts(
    mdt_read_permission, get_mdts_query,
    httpx_test_client, test_user, test_pathway,
    httpx_login_user
):
    """
    Given: mdts present in the system
    """
    future_mdt: MDT = await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime(3000, 1, 1)
    ).create()

    today_mdt: MDT = await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime.now().date()
    ).create()

    await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime(2000, 1, 1)
    ).create()
    """
    When: we run the gql query for getMdts
    """

    current_future_mdts = await httpx_test_client.post(
        url="graphql",
        json={
            "query": get_mdts_query,
            "variables": {
                "pathwayId": test_pathway.id,
                "includePast": False,
            }
        }
    )

    assert_that(current_future_mdts.status_code, equal_to(200))
    mdts = json.loads(current_future_mdts.text)['data']['getMdts']

    """
    Then: we get the mdt today and in future
    """
    assert_that(mdts[0]['id'], equal_to(str(today_mdt.id)))
    assert_that(mdts[1]['id'], equal_to(str(future_mdt.id)))
    assert_that(mdts, has_length(2))


# Scenario: we need all mdts on this pathway
async def test_gql_get_past_mdts(
    mdt_read_permission, get_mdts_query,
    httpx_test_client, test_user, test_pathway,
    httpx_login_user
):
    """
    Given: mdts present in the system
    """
    future_mdt: MDT = await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime(3000, 1, 1)
    ).create()

    today_mdt: MDT = await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime.now().date()
    ).create()

    past_mdt: MDT = await MDT(
        pathway_id=test_pathway.id,
        creator_user_id=test_user.user.id,
        location='test location',
        planned_at=datetime(2000, 1, 1)
    ).create()
    """
    When: we run the gql query for getMdts
    """

    past_mdts = await httpx_test_client.post(
        url="graphql",
        json={
            "query": get_mdts_query,
            "variables": {
                "pathwayId": test_pathway.id,
                "includePast": True,
            }
        }
    )

    assert_that(past_mdts.status_code, equal_to(200))
    mdts = json.loads(past_mdts.text)['data']['getMdts']

    """
    Then: we get the all mdts
    """

    assert_that(mdts[0]['id'], equal_to(str(future_mdt.id)))
    assert_that(mdts[1]['id'], equal_to(str(today_mdt.id)))
    assert_that(mdts[2]['id'], equal_to(str(past_mdt.id)))
    assert_that(mdts, has_length(3))


async def test_user_lacks_permission(login_user, test_client, get_mdts_query):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": get_mdts_query,
            "variables": {
                "pathwayId": "42"
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
