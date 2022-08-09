import json
import pytest
from tests.conftest import UserFixture
from models import User, UserPathway
from hamcrest import assert_that, equal_to, not_none, has_entries
from bcrypt import hashpw, gensalt
from config import config
from httpx import Response


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
# Scenario: a user needs to login
@pytest.mark.asyncio
async def test_login_user(
    test_pathway,
    httpx_test_client
):
    """
    When: a user logs in via the REST endpoint
    """
    USER_INFO = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@test.com",
        "department": "Test dummy department",
        "username": "tdummy",
        "password": "tdummy",
        "default_pathway_id": test_pathway.id
    }

    user: User = await User.create(
        first_name=USER_INFO['first_name'],
        last_name=USER_INFO['last_name'],
        email=USER_INFO['email'],
        department=USER_INFO['department'],
        username=USER_INFO['username'],
        default_pathway_id=USER_INFO['default_pathway_id'],
        password=hashpw(
            USER_INFO['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
    )

    await UserPathway.create(
        user_id=user.id,
        pathway_id=test_pathway.id
    )

    login_query = await httpx_test_client.post(
        url='/rest/login/',
        json=USER_INFO
    )
    assert_that(login_query.status_code, equal_to(200))
    login_result = json.loads(login_query.text)

    """
    Then: we get the user's information EXCLUDING their
    password and the pathways that exist on the system
    """

    assert_that(login_result['user'], not_none())
    assert_that(login_result['user']['id'], not_none())
    assert_that(
        login_result['user']['firstName'], equal_to(USER_INFO['first_name'])
    )
    assert_that(
        login_result['user']['lastName'], equal_to(USER_INFO['last_name'])
    )
    assert_that(
        login_result['user']['department'], equal_to(USER_INFO['department'])
    )
    assert_that(
        login_result['user']['username'], equal_to(USER_INFO['username'])
    )
    assert_that(
        login_result['user']['defaultPathway'],
        not_none()
    )
    assert_that(
        login_result['user']['defaultPathway']['id'],
        equal_to(USER_INFO['default_pathway_id'])
    )
    assert_that(login_result['user']['pathways'], not_none())
    assert_that(login_result['user']['pathways'][0], not_none())
    assert_that(
        login_result['user']['pathways'][0]['id'], equal_to(test_pathway.id)
    )
    assert_that(
        login_result['user']['pathways'][0]['name'],
        equal_to(test_pathway.name)
    )

    assert_that(
        login_result['config'],
        has_entries({
            "hospitalNumberFormat": config['HOSPITAL_NUMBER_FORMAT'],
            "nationalNumberFormat": config['NATIONAL_NUMBER_FORMAT'],
        })
    )


# Scenario: a user needs to login but uses weird capitalization
@pytest.mark.asyncio
async def test_login_user_weird_caps(
    test_pathway,
    httpx_test_client
):
    """
    When: a user logs in via the REST endpoint
    """
    USER_INFO = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@test.com",
        "department": "Test dummy department",
        "username": "tdummy",
        "password": "tdummy",
        "default_pathway_id": test_pathway.id
    }

    user: User = await User.create(
        first_name=USER_INFO['first_name'],
        last_name=USER_INFO['last_name'],
        email=USER_INFO['email'],
        department=USER_INFO['department'],
        username=USER_INFO['username'],
        default_pathway_id=USER_INFO['default_pathway_id'],
        password=hashpw(
            USER_INFO['password'].encode('utf-8'),
            gensalt()
        ).decode('utf-8'),
    )

    await UserPathway.create(
        user_id=user.id,
        pathway_id=test_pathway.id
    )

    login_query = await httpx_test_client.post(
        url='/rest/login/',
        json={
            "username": "tDuMmY",
            "password": "tdummy"
        }
    )
    assert_that(login_query.status_code, equal_to(200))
    login_result = json.loads(login_query.text)

    """
    Then: we get the user's information EXCLUDING their
    password and the pathways that exist on the system
    """

    assert_that(login_result['user'], not_none())
    assert_that(login_result['user']['id'], not_none())
    assert_that(
        login_result['user']['firstName'], equal_to(USER_INFO['first_name'])
    )
    assert_that(
        login_result['user']['lastName'], equal_to(USER_INFO['last_name'])
    )
    assert_that(
        login_result['user']['department'], equal_to(USER_INFO['department'])
    )
    assert_that(
        login_result['user']['username'], equal_to(USER_INFO['username'])
    )
    assert_that(
        login_result['user']['defaultPathway'],
        not_none()
    )
    assert_that(
        login_result['user']['defaultPathway']['id'],
        equal_to(USER_INFO['default_pathway_id'])
    )
    assert_that(login_result['user']['pathways'], not_none())
    assert_that(login_result['user']['pathways'][0], not_none())
    assert_that(
        login_result['user']['pathways'][0]['id'], equal_to(test_pathway.id)
    )
    assert_that(
        login_result['user']['pathways'][0]['name'],
        equal_to(test_pathway.name)
    )


async def test_user_roles_on_login(
        test_user: UserFixture,
        login_user: Response,
):
    """
    When a user logs in, they should have their roles
    """
    login_payload = json.loads(login_user.text)
    assert_that(
        login_payload['user']['roles'][0]['name'],
        equal_to(test_user.role.name)
    )
