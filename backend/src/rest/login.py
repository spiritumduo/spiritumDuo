from .api import _FastAPI
from pydantic import BaseModel
from models import User
from models.db import db

WRONG_USERNAME_OR_PASSWORD_PROMPT="Incorrect username and/or password"

class LoginInput(BaseModel):
    username:str
    password:str

@_FastAPI.post("/login/")
async def login(input:LoginInput):

    user=None
    async with db.acquire(reuse=False) as conn:
        user=await conn.one_or_none(
            User.query.where(User.username==input.username)
        )

    if user is None:
        return{
            "error":WRONG_USERNAME_OR_PASSWORD_PROMPT
        }
    
    if user.password==input.password:
        return{
            "username":user.username,
            "firstName":user.first_name,
            "lastName":user.last_name,
            "department":user.department
        }
    else:
        return{
            "error":WRONG_USERNAME_OR_PASSWORD_PROMPT
        }