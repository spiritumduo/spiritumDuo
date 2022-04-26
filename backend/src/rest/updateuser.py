from typing import List

from pyisemail import is_email
from pyisemail.diagnosis import InvalidDiagnosis

from SdTypes import Permissions
from models import User, db, UserRole, Role
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization
from .restexceptions import NotFoundHTTPException, ConflictHTTPException, UnprocessableHTTPException
from asyncpg.exceptions import UniqueViolationError


class UpdateUserInput(BaseModel):
    id: int
    firstName: str
    lastName: str
    department: str
    email: str
    defaultPathwayId: int
    isActive: bool
    roles: List[int]


@_FastAPI.post("/updateuser/")
@needsAuthorization([Permissions.USER_UPDATE])
async def update_user(request: Request, input: UpdateUserInput):
    if is_email(input.email) is not True:
        problem: InvalidDiagnosis = is_email(input.email, diagnose=True)
        raise UnprocessableHTTPException(f"Invalid email: {problem.message}")

    user = await User.query.where(User.id == input.id).gino.one_or_none()
    if user is None:
        raise NotFoundHTTPException("User does not exist")

    try:
        async with db.acquire() as conn:
            async with conn.transaction() as tx:
                await user.update(
                    first_name=input.firstName,
                    last_name=input.lastName,
                    department=input.department,
                    email=input.email,
                    default_pathway_id=input.defaultPathwayId,
                    is_active=input.isActive,
                ).apply()

                incoming_roles = set(await Role.query.where(Role.id.in_(input.roles)).gino.all())
                missing_role_ids = set(input.roles) - set(map(lambda r: r.id, incoming_roles))

                if len(missing_role_ids) > 0:
                    error_message = "Role ids do not exist:"
                    for id in missing_role_ids:
                        error_message = f"{error_message} {id}"
                    raise UnprocessableHTTPException(error_message)

                current_roles = set(await UserRole.query.where(UserRole.user_id == user.id).gino.all())
                remove_roles = current_roles - incoming_roles
                add_roles = incoming_roles - current_roles

                for role in remove_roles:
                    await role.delete()

                for role in add_roles:
                    await UserRole.create(
                        role_id=role.id,
                        user_id=user.id,
                    )

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
    except UniqueViolationError as e:
        raise ConflictHTTPException("Unique violation error")
