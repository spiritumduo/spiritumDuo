from starlette.authentication import (
    AuthenticationBackend, AuthenticationError, BaseUser,
    AuthCredentials, has_required_scope
)
import inspect
import base64
from models.db import db
from models import User
from starlette.requests import HTTPConnection
from typing import Callable, List
from bcrypt import checkpw

class CredentialsError(Exception):
    """
    Raised when either a username or password does
    not match records
    """
class PermissionsError(Exception):
    """
    Raised when a user is lacking a required 
    permission
    """

class SDUser(BaseUser):
    def __init__(self, id:int=None, username:str=None, firstName:str=None, lastName:str=None, department:str=None) -> None:
        self.id = id
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.department = department

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
    async def authenticate(self, request:HTTPConnection):
        if "Authorization" not in request.headers:
            if request['session']:
                async with db.acquire(reuse=False) as conn:
                    query=User.query.where(User.username==request['session'])
                    user=await conn.one_or_none(query)

                if user:
                    sdUser=SDUser(
                        id=user.id,
                        username=user.username,
                        firstName=user.first_name,
                        lastName=user.last_name,
                        department=user.department
                    )
                    return AuthCredentials(
                        scopes=["authenticated"]
                    ), sdUser
            else:
                return

        auth=request.headers["Authorization"]
        try:
            scheme, credentials=auth.split()
            decoded=base64.b64decode(credentials).decode("ascii")
        except Exception:
            raise AuthenticationError
            
        if scheme.lower()!="basic":
            return

        username, _, password=decoded.partition(":")
        user=None
        async with db.acquire(reuse=False) as conn:
            user=await conn.one_or_none(
                User.query.where(User.username==username)
            )
        if user is None:
            raise CredentialsError("An account with that username does not exist")

        # if user.password!=password:
        if not checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise CredentialsError("The password specified is incorrect")

        sdUser=SDUser(
            id=user.id,
            username=user.username,
            firstName=user.first_name,
            lastName=user.last_name,
            department=user.department
        )

        request.scope['user']=sdUser
        request.scope['session']=sdUser.username
        
        return AuthCredentials(
            scopes=["authenticated"]
        ), sdUser


DEBUG_DISABLE_GRAPHQL_PERMISSION_CHECKING=True

def needsAuthorization(
    scopes:List[str]=None
)-> Callable:
   
    def decorator(func:Callable)->Callable:
        signature=inspect.signature(func)
        info=False

        for _,param in enumerate(signature.parameters.values()):
            if param.name=="info":
                info=True
        if not info:
            raise Exception("Info parameter not found")

        def wrapper(*args, **kwargs):
            request=args[1].context['request']
            if DEBUG_DISABLE_GRAPHQL_PERMISSION_CHECKING:
                return func(*args, **kwargs)

            if has_required_scope(request, scopes):
                return func(*args, **kwargs)
            else:
                return PermissionsError("Missing one or many permissions:",scopes)
        return wrapper
    return decorator