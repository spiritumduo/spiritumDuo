from typing import List
from ariadne.objects import ObjectType
from models import Role, RolePermission
from models.db import db
RoleObjectType = ObjectType("Role")


@RoleObjectType.field("permissions")
async def resolve_role_permissions(
    obj: Role = None, *_
):
    async with db.acquire(reuse=False) as conn:
        role_permissions_query = db.select([RolePermission]).where(
            Role.id == RolePermission.role_id
        ).where(
            obj.id == RolePermission.role_id
        )
        role_permissions: List[RolePermission] = await conn.all(
            role_permissions_query
        )
    return [p.permission for p in role_permissions]
