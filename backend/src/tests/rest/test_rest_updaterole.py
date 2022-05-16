from typing import List

import pytest
import asyncio

from models import Role, RolePermission
from SdTypes import Permissions
from hamcrest import assert_that, equal_to, not_none, is_in, not_


async def test_update_role(login_user, test_client, role_update_permission):
    role_name = "this-test-role"
    new_role_name = "new-test-role"
    permissions = [
        Permissions.ROLE_CREATE,
        Permissions.USER_UPDATE,
        Permissions.MILESTONE_READ
    ]
    new_permissions = [
        Permissions.ROLE_CREATE,
        Permissions.MILESTONE_READ,
        Permissions.ON_PATHWAY_CREATE,
        Permissions.DECISION_CREATE
    ]
    removed_permissions = [
        Permissions.USER_UPDATE,
    ]

    role = await Role.create(
        name=role_name
    )
    awaitable = []
    for p in permissions:
        awaitable.append(
            RolePermission.create(
                role_id=role.id,
                permission=p
            )
        )
    role_permissions = await asyncio.gather(*awaitable)

    res = await test_client.post(
        path="/rest/updaterole/",
        json={
            "id": role.id,
            "name": new_role_name,
            "permissions": new_permissions
        }
    )

    assert_that(res.status_code, equal_to(200))

    role_from_db: Role = await Role.query.where(
        Role.name == new_role_name).gino.one_or_none()
    assert_that(role_from_db, not_none())
    permissions_from_db: List[RolePermission] = await RolePermission.query\
        .where(RolePermission.role_id == role.id)\
        .gino.all()
    for p in permissions_from_db:
        assert_that(p.permission, is_in(new_permissions))
        assert_that(p.permission, not_(is_in(removed_permissions)))
    assert_that(len(permissions_from_db), equal_to(len(new_permissions)))

    result = res.json()
    assert_that(result['id'], equal_to(role.id))
    assert_that(result['name'], equal_to(new_role_name))
    assert_that(result['permissions'], not_(equal_to([])))
    for p in permissions_from_db:
        assert_that(p.permission, is_in(result['permissions']))
    assert_that(len(permissions_from_db), equal_to(len(result['permissions'])))


async def test_user_lacks_permission(login_user, test_client):
    res = await test_client.post(
        path="/rest/createrole/",
        json={
            "name": "test-role"
        }
    )

    assert_that(res.status_code, equal_to(403))
