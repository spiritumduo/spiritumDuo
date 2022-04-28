from typing import List
from SdTypes import Permissions
from rest.restexceptions import NotFoundHTTPException
from models import Role, UserRole, RolePermission
from .api import _FastAPI
from starlette.responses import JSONResponse
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization


class DeleteRoleInput(BaseModel):
    id: int


@_FastAPI.post("/deleterole/")
@needsAuthorization([Permissions.ROLE_DELETE])
async def create_role(request: Request, input: DeleteRoleInput):
    role: Role = await Role.query.where(Role.id == input.id).gino.one_or_none()
    if role is None:
        raise NotFoundHTTPException("Role with that ID not found")

    usersWithRole: List[UserRole] = await UserRole.query.where(
        UserRole.role_id == input.id).gino.all()
    if usersWithRole:
        return JSONResponse({
            "error": "you cannot delete a role with user relations"
        }, status_code=409)

    await RolePermission.delete.where(
        RolePermission.role_id == input.id
    ).gino.status()
    await role.delete()

    return JSONResponse({
        "success": True
    }, status_code=200)
