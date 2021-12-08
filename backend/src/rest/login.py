from fastapi.params import Path
from .api import _FastAPI
from pydantic import BaseModel
from models import User, Pathway
from models.db import db
import json

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
        
    if user.password!=input.password:
        return{
            "error":WRONG_USERNAME_OR_PASSWORD_PROMPT
        }


    pathways=None
    async with db.acquire(reuse=False) as conn:
        pathways=await conn.all(
            Pathway.query
        )

    preparedPathways=[]
    for pathway in pathways:
        preparedPathways.append(pathway.to_dict())

    return{
        "username":user.username,
        "firstName":user.first_name,
        "lastName":user.last_name,
        "department":user.department,
        "pathways":preparedPathways
    }