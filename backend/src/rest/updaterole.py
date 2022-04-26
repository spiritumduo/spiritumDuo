from typing import List
from sqlalchemy import and_
from starlette.responses import JSONResponse

from SdTypes import Permissions
from models import Role, db, RolePermission
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization
from asyncpg.exceptions import UniqueViolationError
from .restexceptions import ConflictHTTPException, NotFoundHTTPException


class UpdateRoleInput(BaseModel):
    id: int
    name: str
    permissions: List[Permissions]


@_FastAPI.post("/updaterole/")
@needsAuthorization([Permissions.ROLE_UPDATE])
async def update_role(request: Request, input: UpdateRoleInput):
    try:
        async with db.transaction() as tx:
            role = await Role.query.where(Role.id == input.id).gino.one_or_none()
            if role is None:
                raise NotFoundHTTPException("Role with that ID not found")
            await role.update(name=input.name).apply()
            permissions: List[RolePermission] = await RolePermission.query\
                .where(RolePermission.role_id == role.id)\
                .gino.all()
            current_perm_set = set(map(lambda p: p.permission, permissions))
            input_perm_set = set(input.permissions)
            to_remove = current_perm_set - input_perm_set
            to_add = input_perm_set - current_perm_set
            # using asyncio.gather causes connection conflicts, and might also break transactions
            for perm in to_remove:
                await RolePermission.delete.where(
                    and_(
                        RolePermission.role_id == role.id,
                        RolePermission.permission == perm
                    )
                ).gino.status()
            for perm in to_add:
                await RolePermission(
                    role_id=role.id,
                    permission=perm
                ).create()

            return JSONResponse(status_code=200)

    except UniqueViolationError:
        raise ConflictHTTPException("Role with that name already exists")
