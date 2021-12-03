from .api import _FastAPI
from fastapi import HTTPException
from pydantic import BaseModel
from asyncpg.exceptions import UniqueViolationError
from models import User

class CreateUserInput(BaseModel):
    username:str
    password:str
    firstName:str
    lastName:str
    department:str

@_FastAPI.post("/createuser/")
async def create_user(input:CreateUserInput):
    newUser=None
    try:
        newUser=await User.create(
            username=input.username,
            password=input.password,
            first_name=input.firstName,
            last_name=input.lastName,
            department=input.department
        )
    except UniqueViolationError as e:
        return {
            "error":"An account with this username already exists!"
        }
    else:
        return{
            "username":newUser.username,
            "firstName":newUser.first_name,
            "lastName":newUser.last_name,
            "department":newUser.department
        }