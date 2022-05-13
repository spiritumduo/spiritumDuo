import re
from typing import List
from SdTypes import Permissions
from models import User, UserPathway, Pathway, Role, UserRole
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from datacreators import CreateUser
from authentication.authentication import needsAuthorization
from .restexceptions import ConflictHTTPException, UnprocessableHTTPException
from asyncpg.exceptions import UniqueViolationError
from pyisemail import is_email
from pyisemail.diagnosis import InvalidDiagnosis


class CreateUserInput(BaseModel):
    username: str
    password: str
    email: str
    firstName: str
    lastName: str
    department: str
    isActive: bool
    pathways: List[int]
    roles: List[int]


@_FastAPI.post("/createuser/")
@needsAuthorization([Permissions.USER_CREATE])
async def create_user(request: Request, input: CreateUserInput):
    if is_email(input.email) is not True:
        problem: InvalidDiagnosis = is_email(input.email, diagnose=True)
        raise UnprocessableHTTPException(f"Invalid email: {problem.message}")

    try:
        user: User = await CreateUser(
            username=input.username,
            password=input.password,
            email=input.email,
            first_name=input.firstName,
            last_name=input.lastName,
            department=input.department,
            is_active=input.isActive
        )

        for pathwayId in input.pathways:
            await UserPathway.create(
                user_id=user.id,
                pathway_id=pathwayId
            )

        db_pathways = await Pathway.join(UserPathway).select().where(
            UserPathway.user_id == user.id).gino.all()
        db_pathways_dicts = []
        for pw in db_pathways:
            db_pathways_dicts.append({
                "id": pw.id,
                "name": pw.name
            })

        for roleId in input.roles:
            await UserRole.create(
                user_id=user.id,
                role_id=roleId
            )

        db_roles = await Role.join(UserRole).select().where(
            UserRole.user_id == user.id).gino.all()
        db_roles_dicts = []
        for role in db_roles:
            db_roles_dicts.append({
                "id": role.id,
                "name": role.name
            })

        return {
            "user": {
                "username": user.username,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "email": user.email,
                "department": user.department,
                "isActive": user.is_active,
                "pathways": db_pathways_dicts,
                "roles": db_roles_dicts,
            }
        }

    except UniqueViolationError as e:
        if re.search("username", e.message):
            raise ConflictHTTPException(
                "An account with this username already exists")
        elif re.search("email", e.message):
            raise ConflictHTTPException(
                "An account with this email already exists")
