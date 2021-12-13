from starlette.authentication import (
    AuthenticationBackend, BaseUser,
    AuthCredentials, has_required_scope
)
import inspect
from starlette.responses import JSONResponse, RedirectResponse, Response
from models.db import db
from models import User, Session, Pathway
from starlette.requests import HTTPConnection
from typing import Callable, List
from bcrypt import checkpw
from random import getrandbits
from datetime import datetime, timedelta
from config import config
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
                    session=db.select([User, Session]).where(Session.session_key==request['session']).where(Session.user_id==User.id).where(Session.expiry>datetime.now())
                    user=await conn.one_or_none(session)
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
                return None


class LoginController:
    WRONG_USERNAME_OR_PASSWORD_PROMPT="Incorrect username and/or password"
    NO_PERMISSIONS_PROMPT="This account is not authenticated for use in this system"

    def __init__(self, model=None):
        self.model=model
        self.view=JSONResponse()

    async def login(self):
        if not self.model['username'] or not self.model['password']:
            self.view.body={
                "error": self.WRONG_USERNAME_OR_PASSWORD_PROMPT
            }
            return self.view

        username=self.model['username']
        password=self.model['password']
        async with db.acquire(reuse=False) as conn:
            user=await conn.one_or_none(
                User.query.where(User.username==username)
            )

        if user is None:
            self.view.body={
                "error":self.WRONG_USERNAME_OR_PASSWORD_PROMPT
            }
            return self.view

        if not checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            self.view.body={
                "error":self.WRONG_USERNAME_OR_PASSWORD_PROMPT
            }
            return self.view 

        sdUser=SDUser(
            id=user.id,
            username=user.username,
            firstName=user.first_name,
            lastName=user.last_name,
            department=user.department
        )

        sessionKey=None
        async with db.acquire(reuse=False) as conn:
            while sessionKey==None:
                tempKey=getrandbits(64)
                result=await conn.one_or_none(
                    Session.query.where(sessionKey==tempKey)
                )
                if not result:
                    sessionKey=tempKey
                
        sessionExpiry=datetime.now()+timedelta(seconds=int(config['SESSION_EXPIRY_LENGTH']))
        
        sdSession=await Session.create(
            session_key=str(sessionKey),
            expiry=sessionExpiry,
            user_id=sdUser.id
        )
        
        pathways=None
        async with db.acquire(reuse=False) as conn:
            pathways=await conn.all(
                Pathway.query
            )

        preparedPathways=[]
        for pathway in pathways:
            preparedPathways.append(pathway.to_dict())

        self.view.set_cookie("SESSION", sdSession.session_key)

        self.view.body={
            "user":{
                "id": sdUser.id,
                "username": sdUser.username,
                "firstName": sdUser.firstName,
                "lastName": sdUser.lastName,
                "department": sdUser.department
            },
            "pathways": preparedPathways
        }
        return self.view
    async def logout():
        pass





DEBUG_DISABLE_PERMISSION_CHECKING=False
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
            if DEBUG_DISABLE_PERMISSION_CHECKING:
                return func(*args, **kwargs)

            if has_required_scope(request, scopes):
                return func(*args, **kwargs)
            else:
                return PermissionsError("Missing one or many permissions:",scopes)
                # return None
        return wrapper
    return decorator