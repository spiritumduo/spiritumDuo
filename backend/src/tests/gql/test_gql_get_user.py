import json
import pytest
from models import User
from hamcrest import assert_that, equal_to, not_none, contains_string
from bcrypt import hashpw, gensalt


@pytest.fixture
def get_user_query() -> str:
    return """
        query getUser($id:ID!){
            getUser(id:$id){
                id
                firstName
                lastName
                username
                lastLogin
                department
                defaultPathway{
                    id
                    name
                }
            }
        }
    """


# Feature: Test user REST/GQL operations
# Scenario: we need to get a user's information
async def test_gql_get_user(context, user_read_permission, get_user_query):
    """
    When: we run the gql query for getUser
    """
    USER_INFO = {
        "first_name": "Test",
        "last_name": "User",
        "department": "Test dummy department",
        "email": "test@test.com",
        "username": "tdummy",
        "password": "tdummy",
        "default_pathway_id": context.PATHWAY.id
    }
    USER = await User.create(
        first_name=USER_INFO['first_name'],
        last_name=USER_INFO['last_name'],
        department=USER_INFO['department'],
        email=USER_INFO['email'],
        username=USER_INFO['username'],
        default_pathway_id=USER_INFO['default_pathway_id'],
        password=hashpw(
            USER_INFO['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
    )

    get_user_query = await context.client.post(
        url="graphql",
        json={
            "query": get_user_query,
            "variables": {
                "id": USER.id
            }
        }
    )

    assert_that(get_user_query.status_code, equal_to(200))
    get_user_query = json.loads(get_user_query.text)['data']['getUser']

    """
    Then: we get the user's information EXCLUDING their password
    """
    assert_that(get_user_query['id'], equal_to(str(USER.id)))
    assert_that(get_user_query['firstName'], equal_to(USER.first_name))
    assert_that(get_user_query['lastName'], equal_to(USER.last_name))
    assert_that(get_user_query['username'], equal_to(USER.username))
    assert_that(
        get_user_query['lastLogin'],
        equal_to(USER.last_login.isoformat())
    )
    assert_that(get_user_query['department'], equal_to(USER.department))
    assert_that(get_user_query['defaultPathway'], not_none())
    assert_that(
        get_user_query['defaultPathway']['id'],
        equal_to(str(context.PATHWAY.id))
    )
    assert_that(
        get_user_query['defaultPathway']['name'],
        equal_to(str(context.PATHWAY.name))
    )


async def test_user_lacks_permission(login_user, test_client, get_user_query):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": get_user_query,
            "variables": {
                "id": "test"
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
