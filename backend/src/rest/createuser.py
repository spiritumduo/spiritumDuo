from .api import _FastAPI
from pydantic import BaseModel
from asyncpg.exceptions import UniqueViolationError
from datacreators import CreateUser
class CreateUserInput(BaseModel):
    username:str
    password:str
    firstName:str
    lastName:str
    department:str

@_FastAPI.post("/createuser/")
async def create_user(input:CreateUserInput):
    user=await CreateUser(
        username=input.username,
        password=input.password,
        first_name=input.firstName,
        last_name=input.lastName,
        department=input.department
    )

    return user