from SdTypes import Permissions
from models.Role import Role
from datacreators import create_role as role_datacreator
from .api import _FastAPI
from starlette.responses import JSONResponse
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization
from asyncpg.exceptions import UniqueViolationError
from .restexceptions import UniqueViolationHTTPException


class CreateRoleInput(BaseModel):
    name: str


@_FastAPI.post("/createrole/")
@needsAuthorization([Permissions.ROLE_CREATE])
async def create_role(request: Request, input: CreateRoleInput):
    try:
        role: Role = await role_datacreator(name=input.name)
    except UniqueViolationError:
        raise UniqueViolationHTTPException("Role already exists")
    return JSONResponse({
        "id": role.id,
        "name": role.name,
        "permissions": []
    }, status_code=200)
