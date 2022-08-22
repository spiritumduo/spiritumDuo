import pytest
from typing import List
from models import Role, UserRole, User, Pathway, UserPathway
from tests.conftest import UserFixture
from hamcrest import (
    assert_that, equal_to,
    contains_inanyorder, contains_string,
    not_none
)
from bcrypt import checkpw


@pytest.fixture
async def test_roles(db_start_transaction) -> List[Role]:
    roles = []
    for i in range(0, 5):
        roles.append(await Role.create(
            name=f"test-role-{i}"
        ))
    return roles


@pytest.fixture
async def test_pathways(db_start_transaction) -> List[Pathway]:
    pathways = []
    for i in range(0, 5):
        pathways.append(await Pathway.create(
            name=f"test-pathway-{i}"
        ))
    return pathways


@pytest.fixture
def user_update_details(test_user: UserFixture):
    return {
        "id": test_user.user.id,
        "username": "new-username",
        "firstName": "new-firstName",
        "lastName": "new-lastName",
        "password": "new-password",
        "email": "new@email.com",
        "roles": [],
        "pathways": [],
        "department": "new-department",
        "isActive": False,
    }


async def test_valid_user_update_with_roles(
        login_user, test_client, user_update_permission,
        test_user: UserFixture, test_roles: List[Role],
        test_pathways: List[Pathway], user_update_details
):
    """
    When a valid user attempt to update a user with roles. it should succeed
    """
    new_role_1 = test_roles[0]
    new_role_2 = test_roles[2]
    new_role_3 = test_roles[3]
    user_update_details["roles"] = [
        new_role_1.id,
        new_role_3.id,
        new_role_2.id,
    ]

    user_update_details["pathways"] = [
        test_pathways[0].id,
        test_pathways[1].id,
        test_pathways[2].id,
    ]

    res = await test_client.post(
        path="/rest/updateuser/",
        json=user_update_details
    )

    assert_that(res.status_code, equal_to(200))
    decoded = res.json()

    user: User = await User.query.where(
        User.id == test_user.user.id).gino.one_or_none()
    assert_that(user, not_none())
    assert_that(user.first_name, equal_to(decoded['user']['firstName']))
    assert_that(
        checkpw(
            user_update_details["password"].encode('utf-8'),
            user.password.encode('utf-8'),
        ),
        equal_to(True)
    )

    user_roles = await UserRole.query.where(
        UserRole.user_id == test_user.user.id).gino.all()
    user_role_ids = list(map(lambda ur: ur.role_id, user_roles))
    # User Roles exist in the database
    assert_that(
        user_update_details["roles"],
        contains_inanyorder(*user_role_ids)
    )

    user_pathways = await UserPathway.query.where(
        UserPathway.user_id == test_user.user.id).gino.all()
    user_pathway_ids = list(map(lambda upw: upw.pathway_id, user_pathways))
    # User Pathways exist in the database
    assert_that(
        user_update_details["pathways"],
        contains_inanyorder(*user_pathway_ids)
    )


async def test_valid_user_update_without_roles_or_pathways(
        login_user, test_client, user_update_permission,
        test_user: UserFixture, test_roles: List[Role],
        user_update_details
):
    """
    When a valid user attempt to update a user without roles. it should succeed
    """
    res = await test_client.post(
        path="/rest/updateuser/",
        json=user_update_details
    )
    decoded = res.json()

    user = await User.query.where(
        User.id == test_user.user.id).gino.one_or_none()
    assert_that(user, not_none())
    assert_that(user.first_name, equal_to(decoded['user']['firstName']))

    assert_that(res.status_code, equal_to(200))

    user_roles = await UserRole.query.where(
        UserRole.user_id == test_user.user.id).gino.all()
    user_role_ids = list(map(lambda ur: ur.role_id, user_roles))
    assert_that(
        user_update_details["roles"],
        contains_inanyorder(*user_role_ids)
    )

    user_pathways = await UserRole.query.where(
        UserPathway.user_id == test_user.user.id).gino.all()
    user_pathway_ids = list(map(lambda upw: upw.pathway_id, user_pathways))
    assert_that(
        user_update_details["pathways"],
        contains_inanyorder(*user_pathway_ids)
    )


async def test_invalid_email_format(
        login_user, test_client, user_update_permission,
        test_user: UserFixture, user_update_details
):
    """
    When a valid user attempt to update with invalid email,
    it should return 422
    """
    user_update_details["email"] = "invalidemail"
    res = await test_client.post(
        path="/rest/updateuser/",
        json=user_update_details
    )

    assert_that(res.status_code, equal_to(422))
    error_response = res.json()
    assert_that(error_response['detail'], contains_string("email"))


async def test_invalid_permission_user_update(
        login_user, test_client, test_user: UserFixture,
        test_roles: List[Role], user_update_details
):
    """
    When a logged-in user lacks the required permission,
    it should return 403
    """
    user_update_details["roles"] = ["1"]
    res = await test_client.post(
        path="/rest/updateuser/",
        json=user_update_details
    )

    assert_that(res.status_code, equal_to(403))
