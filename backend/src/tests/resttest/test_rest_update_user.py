from dataclasses import dataclass
from typing import List

import pytest
from async_asgi_testclient.response import Response

from models import Role, UserRole
from ..conftest import UserFixture
from hamcrest import assert_that, equal_to


@pytest.fixture
async def test_roles(db_start_transaction) -> List[Role]:
    roles = []
    for i in range(0, 5):
        roles.append(await Role.create(
            name=f"test-role-{i}"
        ))
    return roles


@pytest.fixture
def user_update_details(test_user: UserFixture):
    return {
        "id": test_user.user.id,
        "firstName": "new-firstName",
        "lastName": "new-lastName",
        "email": "new@email.com",
        "department": "new-department",
        "defaultPathwayId": test_user.user.default_pathway_id,
        "isActive": False,
    }


async def test_valid_user_update(
        login_user, test_client, user_update_permission, test_user: UserFixture,
        test_roles: List[Role], user_update_details
):
    """
    When a valid user attempt to update a user
    """
    new_role_1 = test_roles[0]
    new_role_2 = test_roles[2]
    new_role_3 = test_roles[3]
    user_update_details["roles"] = [
        new_role_1.id,
        new_role_3.id,
        new_role_2.id,
    ]
    res = await test_client.post(
        path="/rest/createuser/",
        json=user_update_details
    )

    user_roles = await UserRole.query.where(UserRole.user_id == test_user.user.id).gino.all()
    assert_that(res.status_code, equal_to(200))

