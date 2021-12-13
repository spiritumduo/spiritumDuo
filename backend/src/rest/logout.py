from .api import _FastAPI
from starlette.requests import Request
from models import Session
from models.db import db
WRONG_USERNAME_OR_PASSWORD_PROMPT="Incorrect username and/or password"
NO_PERMISSIONS_PROMPT="This account is not authenticated for use in this system"

@_FastAPI.post("/logout/")
async def login(request: Request):
    if request['session']:
        async with db.acquire(reuse=False) as conn:
            session=Session.delete.where(Session.session_key==request['session'])
            await conn.scalar(session)
            request.scope['session']=None
            return{
                "success"
            }
    else:
        return {
            "error":"No active session found"
        }