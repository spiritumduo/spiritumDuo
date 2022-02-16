from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from datacreators import CreateUser
from authentication.authentication import needsAuthenticated

class CreateUserInput(BaseModel):
    username:str
    password:str
    firstName:str
    lastName:str
    department:str
    defaultPathwayId:int


@_FastAPI.post("/createuser/")
@needsAuthenticated
async def create_user(request:Request, input:CreateUserInput):
    user=await CreateUser(
        username=input.username,
        password=input.password,
        first_name=input.firstName,
        last_name=input.lastName,
        department=input.department,
        default_pathway_id=int(input.defaultPathwayId)
    )
    return user