import pytest
from async_asgi_testclient.response import Response

from models import User, Pathway
from hamcrest import assert_that, equal_to


@pytest.fixture
def user_connection_query():
    return """
        query UserListQuery($first: Int $after: String) {
            getUserConnection(first: $first, after: $after) {
              totalCount
              pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  firstName
                  lastName
                  department
                }
                cursor
              }
            }
        }
    """


@pytest.fixture
async def insert_test_users(test_pathway: Pathway):
    users = []
    for i in range(0, 200):
        users.append({
            "first_name": f"john-{i}",
            "last_name": f"doe-{i}",
            "username": f"test-user-{i}",
            "email": f"john-{i}@test-sd-fake-domain.com",
            "department": f"dept-{i}",
            "password": f"password-{i}",
            "default_pathway_id": test_pathway.id
        })
    await User.insert().gino.all(users)


async def test_user_connection(
        login_user: Response, test_client,
        user_read_permission, user_connection_query,
        insert_test_users
):
    res = await test_client.post(
        path="/graphql",
        json={
            "query": user_connection_query,
            "variables": {
                "first": 50,
            },
        }
    )

    assert_that(res.status_code, equal_to(200))
