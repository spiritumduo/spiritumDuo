from models import User
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from datacreators import CreateUser
from authentication.authentication import needsAuthorization
from asyncpg.exceptions import UniqueViolationError


class CreateUserInput(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    department: str
    defaultPathwayId: int
    isActive: bool


@needsAuthorization
@_FastAPI.post("/createuser/")
async def create_user(request: Request, input: CreateUserInput):
    try:
        user: User = await CreateUser(
            username=input.username,
            password=input.password,
            first_name=input.firstName,
            last_name=input.lastName,
            department=input.department,
            default_pathway_id=int(input.defaultPathwayId),
            is_active=input.isActive
        )
    except UniqueViolationError:
        return {"error": "an account with this username already exists"}

    return {
        "user": {
            "username": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "department": user.department,
            "defaultPathwayId": user.default_pathway_id,
            "isActive": user.is_active
        }
    }
