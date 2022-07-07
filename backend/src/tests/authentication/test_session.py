import datetime

import pytest
from hamcrest import assert_that, equal_to

from tests.conftest import UserFixture
from models import Session


async def test_session_valid(login_user, test_client, role_create_permission):
    """
    Test valid session. Just assert that this operation succeeds, we'll pick creating
    roles because we need an endpoint
    """
    role_name = "new-test-role"
    res = await test_client.post(
        path="/rest/createrole/",
        json={
            "name": role_name
        }
    )

    assert_that(res.status_code, equal_to(200))


async def test_session_invalid(login_user, test_user: UserFixture, test_client, role_create_permission):
    """
    Invalid the session in the database
    """
    await Session.delete.where(Session.user_id == test_user.user.id).gino.one_or_none()

    role_name = "new-test-role"
    res = await test_client.post(
        path="/rest/createrole/",
        json={
            "name": role_name
        }
    )

    assert_that(res.status_code, equal_to(403))


async def test_session_timeout(login_user, test_user: UserFixture, test_client, role_create_permission):
    """
    Expire the session in the database
    :return:
    """
    session = await Session.query.where(Session.user_id == test_user.user.id).gino.one_or_none()
    await session.update(expiry=datetime.date.min).apply()
    role_name = "new-test-role"
    res = await test_client.post(
        path="/rest/createrole/",
        json={
            "name": role_name
        }
    )

    assert_that(res.status_code, equal_to(403))
