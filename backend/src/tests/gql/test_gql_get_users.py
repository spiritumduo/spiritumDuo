import json
from typing import List
import pytest
from models import User
from hamcrest import (
    assert_that,
    contains,
    equal_to,
    contains_string,
    contains_inanyorder
)


@pytest.fixture
def get_users_query() -> str:
    return """
        query getUsers{
            getUsers{
                id
            }
        }
    """


# Feature: Test user REST/GQL operations
# Scenario: we need to get a user's information
async def test_gql_get_users(
    user_read_permission, get_users_query,
    test_pathway, httpx_test_client,
    httpx_login_user, test_user
):
    """
    When: we run the gql query for getUsers
    """

    result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": get_users_query,
        }
    )

    assert_that(result.status_code, equal_to(200))
    users_list: List[User] = json.loads(result.text)['data']['getUsers']

    """
    Then: we get the users
    """
    assert_that(
        users_list,
        contains({'id': str(test_user.user.id)})
    )


async def test_user_lacks_permission(login_user, test_client, get_users_query):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": get_users_query,
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
