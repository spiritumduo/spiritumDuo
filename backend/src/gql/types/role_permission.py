from ariadne.objects import ObjectType

RolePermissionObjectType = ObjectType("RolePermission")


@RolePermissionObjectType.field("name")
async def resolve_role_permission(
    obj=None, *_
):
    return obj
