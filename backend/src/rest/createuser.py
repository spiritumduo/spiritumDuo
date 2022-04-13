from models import User
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from datacreators import CreateUser
from authentication.authentication import needsAuthorization


class CreateUserInput(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    department: str
    defaultPathwayId: int
    isAdmin: bool


@_FastAPI.post("/createuser/")
@needsAuthorization(["admin"])
async def create_user(request: Request, input: CreateUserInput):
    user: User = await CreateUser(
        username=input.username,
        password=input.password,
        first_name=input.firstName,
        last_name=input.lastName,
        department=input.department,
        default_pathway_id=int(input.defaultPathwayId),
        is_admin=input.isAdmin
    )
    return {
        "username": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "department": user.department,
        "defaultPathwayId": user.default_pathway_id,
        "isAdmin": user.is_admin,
    }
