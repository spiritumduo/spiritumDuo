from starlette.authentication import (
    AuthenticationBackend, BaseUser,
    AuthCredentials, has_required_scope
)
import inspect

from starlette.responses import JSONResponse

from SdTypes import Permissions
from models.db import db
from models import User, Session, RolePermission, Role, UserRole
from starlette.requests import HTTPConnection
from typing import Callable, List, Optional
from datetime import datetime
from functools import wraps


class PermissionsError(Exception):
    """
    Raised when a user is lacking a required
    permission
    """


class SessionAlreadyExists(Exception):
    """
    Raised when a user attempts to login
    despite already having an active
    session
    """


class SDUser(BaseUser):
    def __init__(
        self,
        id: int = None,
        username: str = None,
        firstName: str = None,
        lastName: str = None,
        department: str = None,
        default_pathway_id: int = None,
        isAdmin: bool = None
        # TODO: make all either camelcase or snakecase
    ) -> None:
        self.id = id
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.department = department
        self.default_pathway_id = default_pathway_id
        self.isAdmin = isAdmin

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def get_display_name(self) -> str:
        return self.username

    @property
    def get_formatted_name(self) -> str:
        return self.firstName+" "+self.lastName

    @property
    def get_department(self) -> str:
        return self.department


class SDAuthentication(AuthenticationBackend):
    """
    The backend's authentication mechanism as a middleware
    """

    async def authenticate(self, request: HTTPConnection):
        if "Authorization" not in request.headers:
            if request['session']:
                async with db.acquire(reuse=False) as conn:
                    session = db.select([User, Session]).where(
                        Session.session_key == str(request['session'])
                    ).where(
                        Session.user_id == User.id
                    ).where(
                        Session.expiry > datetime.now()
                    ).where(
                        User.is_active == True
                    )
                    user = await conn.one_or_none(session)
                if user:
                    sdUser = SDUser(
                        id=user.id,
                        username=user.username,
                        firstName=user.first_name,
                        lastName=user.last_name,
                        department=user.department,
                        default_pathway_id=user.default_pathway_id,
                    )
                    async with db.acquire(reuse=False) as conn:
                        query = RolePermission.outerjoin(Role)\
                            .outerjoin(UserRole)\
                            .outerjoin(User)\
                            .select()\
                            .where(User.id == user.id)
                        permissions: List[RolePermission] = await conn.all(query)
                    scopes = [Permissions.AUTHENTICATED]
                    for p in permissions:
                        scopes.append(p.permission)
                    return AuthCredentials(
                        scopes=scopes
                    ), sdUser
            else:
                return AuthCredentials(scopes=[]), None


def needsAuthorization(
    required_scopes: Optional[List[Permissions]] = None
) -> Callable:
    """
    A decorator to ensure a user has one of a specified
    list of scopes/permissions
    """
    def decorator(func: Callable) -> Callable:
        signature = inspect.signature(func)
        info = False
        request = False

        for _, param in enumerate(signature.parameters.values()):
            if param.name == "info":
                info = True
            elif param.name == "request":
                request = True
        if not info and not request:
            raise Exception("Info or request parameter not found")

        def wrapper(*args, **kwargs):
            required_scopes.append(Permissions.AUTHENTICATED)
            if args[1].context:
                request = args[1].context['request']
            else:
                request = args[1]
            if has_required_scope(request, required_scopes):
                return func(*args, **kwargs)
            else:
                return PermissionsError(
                    "Missing one or many permissions:",
                    required_scopes
                )
        return wrapper
    return decorator


def needsAuthenticated(func: Callable) -> Callable:
    """
    A decorator to ensure a user is logged in (has
    authenticated)
    """
    signature = inspect.signature(func)
    requestIndex = None
    for index, param in enumerate(signature.parameters.values()):
        if param.name == "request":
            requestIndex = index

    @wraps(func)
    async def wrapper(*args, **kwargs):
        if kwargs.get("request") is not None:
            request = kwargs.get("request")
        elif requestIndex is not None and args[requestIndex]:
            request = args[requestIndex]
        else:
            raise Exception("Request parameter not found in args or kwargs")

        if request is None:
            raise Exception("Request parameter not found")
        if not has_required_scope(request, [Permissions.AUTHENTICATED]):
            return JSONResponse(status_code=401)

        if inspect.iscoroutinefunction(func):
            return await func(*args, **kwargs)
        else:
            return func(*args, **kwargs)
    return wrapper
