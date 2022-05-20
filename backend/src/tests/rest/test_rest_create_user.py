import json
import pytest
from hamcrest import (
    assert_that, equal_to, has_item,
    not_, has_entries, contains_string,
    not_none
)
from models.User import User


@pytest.fixture
def new_clinician(test_pathway):
    return {
        "firstName": "JOHN",
        "lastName": "SMITH",
        "username": "john.smith123",
        "email": "test@test.com",
        "password": "VERYSECUREPASSWORD",
        "department": "ONCOLOGY",
        "isActive": True,
        "pathways": [],
        "roles": [],
    }


# Feature: User account operations
# Scenario: a new user needs to be added into the system
@pytest.mark.asyncio
async def test_create_user_correct(
    user_create_permission, new_clinician,
    httpx_test_client, httpx_login_user
):
    """
    When: we create their user account
    """
    NEW_CLINICIAN = new_clinician

    create_user_account = await httpx_test_client.post(
        url="rest/createuser/",
        json=NEW_CLINICIAN
    )
    print(json.loads(create_user_account.text))
    assert_that(create_user_account.status_code, equal_to(200))

    query_result = json.loads(create_user_account.text)

    del NEW_CLINICIAN['password']  # will not be returned
    assert_that(query_result, not_(has_item('error')))
    assert_that(query_result['user'], has_entries(NEW_CLINICIAN))


# Scenario: a new user needs to be added into the system and uses
# weird caps for username
@pytest.mark.asyncio
async def test_create_user_wierd_caps(
    user_create_permission, new_clinician,
    httpx_test_client, httpx_login_user
):
    """
    When: we create their user account
    """
    NEW_CLINICIAN = new_clinician

    new_clinician['username'] = "JoHn.SmItH123"

    create_user_account = await httpx_test_client.post(
        url="rest/createuser/",
        json=NEW_CLINICIAN
    )
    print(json.loads(create_user_account.text))
    assert_that(create_user_account.status_code, equal_to(200))

    query_result = json.loads(create_user_account.text)

    del NEW_CLINICIAN['password']  # will not be returned
    new_clinician['username'] = str(new_clinician['username']).lower()
    assert_that(query_result, not_(has_item('error')))
    assert_that(query_result['user'], has_entries(NEW_CLINICIAN))

    user: User = await User.query.where(
        User.username == new_clinician['username'])\
        .gino.one_or_none()

    assert_that(user, not_none())


# Feature: User account operations
# Scenario: a new user needs to be added into the system but
# username already exists
@pytest.mark.asyncio
async def test_create_user_username_preexists(
    user_create_permission, new_clinician,
    httpx_test_client, httpx_login_user
):
    """
    When: we create their user account
    """

    await User.create(
        first_name=new_clinician['firstName'],
        last_name=new_clinician['lastName'],
        department=new_clinician['department'],
        email=new_clinician['email'],
        username=new_clinician['username'],
        password=new_clinician['password'],
        is_active=new_clinician['isActive']
    )

    NEW_CLINICIAN = new_clinician

    res = await httpx_test_client.post(
        url="rest/createuser/",
        json=NEW_CLINICIAN
    )
    assert_that(res.status_code, equal_to(409))

    post_result = res.json()

    assert_that(post_result['detail'], contains_string("username"))
    assert_that(post_result, not_(has_item('user')))


async def test_user_lacks_permission(login_user, test_client, new_clinician):
    """
    When logged in user lacks required authorisation, it should refuse access
    """
    res = await test_client.post(
        path="/rest/createuser/",
        json=new_clinician
    )
    assert_that(res.status_code, equal_to(403))
    post_result = res.json()
    assert_that(post_result['detail'], contains_string('permissions'))


async def test_invalid_email(
    login_user, test_client,
    user_create_permission, new_clinician
):
    """
    When the email format is invalid, it should reject with HTTP status 422
    """
    new_clinician['email'] = "invalidemail"
    res = await test_client.post(
        path="/rest/createuser/",
        json=new_clinician
    )
    assert_that(res.status_code, equal_to(422))
    post_result = res.json()
    assert_that(post_result['detail'], contains_string("email"))
