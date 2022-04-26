from SdTypes import Permissions
from datacreators import create_role as role_datacreator
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization
from asyncpg.exceptions import UniqueViolationError
from .restexceptions import ConflictHTTPException


class CreateRoleInput(BaseModel):
    name: str


@_FastAPI.post("/createrole/")
@needsAuthorization([Permissions.ROLE_CREATE])
async def create_role(request: Request, input: CreateRoleInput):
    try:
        role = await role_datacreator(name=input.name)
    except UniqueViolationError:
        raise ConflictHTTPException("Role already exists")
    return role
