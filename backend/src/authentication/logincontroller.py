from base64 import b64encode
from typing import List, Union
from gino.loader import ModelLoader
from gino import Gino
from starlette.responses import JSONResponse
from models.db import db
from models import User, Session, Pathway, Role, UserRole, UserPathway
from starlette.requests import Request
from bcrypt import checkpw
from random import getrandbits
from datetime import datetime, timedelta
from config import config
from .authentication import SDUser
import itsdangerous


class ContextNotDefined(Exception):
    """
    Raised when the context variable has
    not been specified when requried
    """


class LoginController:
    """
    A class to handle authentication methods
    """

    _WRONG_USERNAME_OR_PASSWORD_PROMPT = "Incorrect username and/or password"
    _NO_PERMISSIONS_PROMPT = """
        This account is not authenticated for use in this system
    """

    def __init__(self, context=None):
        if not context:
            raise ContextNotDefined()
        self._context = context
        self._db: Gino = context['db']

    async def login(self, request: Request = None):
        """
        This collects user information from the request and
        attempts to authenticate the user

        Parameters:
            request (Request): request information

        Returns:
            JSONResponse
        """
        if request['session']:
            request.scope['session'] = None

        inputData = await request.json()
        if not inputData['username'] or not inputData['password']:
            return JSONResponse({
                "error": self._WRONG_USERNAME_OR_PASSWORD_PROMPT
            })

        username = str(inputData['username']).lower()
        password = inputData['password']
        async with self._db.acquire(reuse=False) as conn:
            user: User = await conn.one_or_none(
                User.query.where(User.username == username)
            )

        if user is None:
            return JSONResponse({
                "error": self._WRONG_USERNAME_OR_PASSWORD_PROMPT
            })

        if not checkpw(
            password.encode('utf-8'),
            user.password.encode('utf-8')
        ):
            return JSONResponse({
                "error": self._WRONG_USERNAME_OR_PASSWORD_PROMPT
            })

        sdUser = SDUser(
            id=user.id,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            department=user.department,
            default_pathway_id=user.default_pathway_id,
        )

        async with self._context['db'].acquire(reuse=False) as conn:
            role_query = Role.outerjoin(UserRole)\
                .outerjoin(User)\
                .select()\
                .where(User.id == user.id)\
                .execution_options(loader=ModelLoader(Role))
            roles: List[Role] = await conn.all(role_query)

            pathway_query = Pathway.outerjoin(UserPathway)\
                .outerjoin(User)\
                .select()\
                .where(User.id == user.id)\
                .execution_options(loader=ModelLoader(Pathway))
            pathways: List[Pathway] = await conn.all(pathway_query)

            default_pathway: Union[Pathway, None] = await conn.one_or_none(
                Pathway.query.where(Pathway.id == sdUser.default_pathway_id)
            )
            default_pathway_dict = None
            if default_pathway is not None:
                default_pathway_dict = {
                    "id": default_pathway.id,
                    "name": default_pathway.name
                }

            role_dicts = []
            for r in roles:
                role_dicts.append({
                    "id": r.id,
                    "name": r.name
                })

            user_pathways = []
            for p in pathways:
                user_pathways.append({
                    "id": p.id,
                    "name": p.name
                })

        sessionKey = None
        async with self._context['db'].acquire(reuse=False) as conn:
            while sessionKey is None:
                tempKey = getrandbits(64)
                result: Union[Session, None] = await conn.one_or_none(
                    Session.query.where(Session.session_key == str(tempKey))
                )
                if result is not None:
                    sessionKey = tempKey

        sessionExpiry = datetime.now()+timedelta(
            seconds=int(config['SESSION_EXPIRY_LENGTH'])
        )

        sdSession: Session = await Session.create(
            session_key=str(sessionKey),
            expiry=sessionExpiry,
            user_id=sdUser.id
        )

        res = JSONResponse({
            "user": {
                "id": sdUser.id,
                "username": sdUser.username.lower(),
                "firstName": sdUser.first_name,
                "lastName": sdUser.last_name,
                "department": sdUser.department,
                "defaultPathway": default_pathway_dict,
                "token": str(sessionKey),
                "roles": role_dicts,
                "pathways": user_pathways
            },
            "config": {
                "hospitalNumberFormat": config['HOSPITAL_NUMBER_FORMAT'],
                "nationalNumberFormat": config['NATIONAL_NUMBER_FORMAT'],
            }
        })

        signer = itsdangerous.TimestampSigner(
            str(config['SESSION_SECRET_KEY'])
        )
        cookieValue = b64encode(sdSession.session_key.encode("utf-8"))
        cookieValue = signer.sign(cookieValue)

        res.set_cookie(
            key="SDSESSION",
            value=cookieValue.decode("utf-8"),
            max_age=config['SESSION_EXPIRY_LENGTH'],
            path="/"
        )
        return res

    async def logout(self, request: Request = None):
        """
        This collects user information from the request and
        attempts to logout the user, destroying the session
        key

        Parameters:
            request (Request): request information

        Returns:
            JSONResponse
        """

        if request['session']:
            async with db.acquire(reuse=False) as conn:
                await conn.scalar(
                    Session.delete.where(
                        Session.session_key == str(request['session'])
                    )
                )
                res = JSONResponse({
                    "success": True
                })
                res.delete_cookie(key="SDSESSION")
                request.scope['session'] = None
                return res
        else:
            return JSONResponse({
                "error": "No valid session"
            })
