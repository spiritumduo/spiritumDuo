import pytest
from SdTypes import Permissions
from models import Role, RolePermission, User, UserRole
from hamcrest import assert_that, equal_to, none, not_none


@pytest.fixture
def new_clinician(test_pathway):
    return {
        "first_name": "JOHN",
        "last_name": "SMITH",
        "username": "JOHN.SMITH123",
        "email": "test@test.email.invalidtld",
        "password": "VERYSECUREPASSWORD",
        "department": "ONCOLOGY",
        "default_pathway_id": test_pathway.id,
        "is_active": True
    }


async def test_delete_role(login_user, test_client, role_delete_permission):
    role_name = "test role go brr"

    role = await Role.create(
        name=role_name
    )
    role_id = role.id

    for perm in Permissions:
        await RolePermission.create(
            role_id=role_id,
            permission=perm
        )

    res = await test_client.post(
        path="/rest/deleterole/",
        json={
            "id": role_id
        }
    )

    role_from_db = await Role.query.where(
        Role.id == role_id).gino.one_or_none()
    assert_that(role_from_db, none())

    result = res.json()
    assert_that(result['success'], equal_to(True))


async def test_delete_role_fk_conflict(
    login_user,
    test_client,
    role_delete_permission,
    new_clinician
):
    role_name = "test role go brr"

    role = await Role.create(
        name=role_name
    )
    role_id = role.id

    for perm in Permissions:
        await RolePermission.create(
            role_id=role_id,
            permission=perm
        )

    clinician: User = await User.create(
        **new_clinician
    )

    await UserRole.create(
        user_id=clinician.id,
        role_id=role_id
    )

    res = await test_client.post(
        path="/rest/deleterole/",
        json={
            "id": role_id
        }
    )

    role_from_db: Role = await Role.query.where(
        Role.id == role_id).gino.one_or_none()
    assert_that(role_from_db, not_none())
    assert_that(role_from_db.id, equal_to(role_id))

    assert_that(res.status_code, equal_to(409))

    result = res.json()
    assert_that(result['error'], not_none())


async def test_user_lacks_permission(login_user, test_client):
    res = await test_client.post(
        path="/rest/createrole/",
        json={
            "name": "new-test-role"
        }
    )

    assert_that(res.status_code, equal_to(403))
