from typing import List, Union

from pyisemail import is_email
from pyisemail.diagnosis import InvalidDiagnosis

from SdTypes import Permissions
from models import User, db, UserRole, Role, Pathway, UserPathway
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from authentication.authentication import needsAuthorization
from .restexceptions import (
    NotFoundHTTPException,
    ConflictHTTPException,
    UnprocessableHTTPException
)
from asyncpg.exceptions import UniqueViolationError


class UpdateUserInput(BaseModel):
    id: int
    firstName: str
    lastName: str
    department: str
    username: str
    email: str
    isActive: bool
    roles: List[int]
    pathways: List[int]


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
            async with conn.transaction():
                await user.update(
                    first_name=input.firstName,
                    last_name=input.lastName,
                    username=input.username,
                    department=input.department,
                    email=input.email,
                    is_active=input.isActive,
                ).apply()

                incoming_roles = set(await Role.query.where(
                    Role.id.in_(input.roles)).gino.all())
                missing_role_ids = set(input.roles) - set(
                    map(lambda r: r.id, incoming_roles))

                incoming_pathways = set(await Pathway.query.where(
                    Pathway.id.in_(input.pathways)).gino.all())
                missing_pathway_ids = set(input.pathways) - set(
                    map(lambda p: p.id, incoming_pathways))

                if len(missing_role_ids) > 0:
                    error_message = "Role ids do not exist:"
                    for id in missing_role_ids:
                        error_message = f"{error_message} {id}"
                    raise UnprocessableHTTPException(error_message)

                if len(missing_pathway_ids) > 0:
                    error_message = "Pathway ids do not exist:"
                    for id in missing_pathway_ids:
                        error_message = f"{error_message} {id}"
                    raise UnprocessableHTTPException(error_message)

                current_roles = set(await UserRole.query.where(
                    UserRole.user_id == user.id).gino.all())
                remove_roles = current_roles - incoming_roles
                add_roles = incoming_roles - current_roles

                current_pathways = set(await UserPathway.query.where(
                    UserPathway.user_id == user.id).gino.all())
                remove_pathways = current_pathways - incoming_pathways
                add_pathways = incoming_pathways - current_pathways

                for role in remove_roles:
                    await role.delete()

                for role in add_roles:
                    await UserRole.create(
                        role_id=role.id,
                        user_id=user.id,
                    )

                for pathway in remove_pathways:
                    await pathway.delete()

                for pathway in add_pathways:
                    await UserPathway.create(
                        pathway_id=pathway.id,
                        user_id=user.id,
                    )

                defaultPathway: Union[Pathway, None] = await conn.one_or_none(
                    Pathway.query.where(Pathway.id == user.default_pathway_id)
                )

                roles = await Role.join(UserRole).select().where(
                    UserRole.user_id == user.id).gino.all()
                role_dicts = []
                for r in roles:
                    role_dicts.append({
                        "id": r.id,
                        "name": r.name
                    })

                db_pathways = await Pathway.join(UserPathway).select().where(
                    UserPathway.user_id == user.id).gino.all()
                db_pathways_dicts = []
                for pw in db_pathways:
                    db_pathways_dicts.append({
                        "id": pw.id,
                        "name": pw.name
                    })

                return {
                    "user": {
                        "username": user.username,
                        "firstName": user.first_name,
                        "lastName": user.last_name,
                        "email": user.email,
                        "department": user.department,
                        "defaultPathway": defaultPathway,
                        "isActive": user.is_active,
                        "roles": role_dicts,
                        "pathways": db_pathways_dicts
                    }
                }
    except UniqueViolationError:
        raise ConflictHTTPException("Unique violation error")
