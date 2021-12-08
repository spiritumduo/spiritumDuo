from authentication.authentication import CredentialsError
from .api import _FastAPI
from starlette.requests import Request
from pydantic import BaseModel
from models import User, Pathway
from models.db import db
from authentication import SDAuthentication
WRONG_USERNAME_OR_PASSWORD_PROMPT="Incorrect username and/or password"
NO_PERMISSIONS_PROMPT="This account is not authenticated for use in this system"

class LoginInput(BaseModel):
    username:str
    password:str

@_FastAPI.post("/login/")
async def login(request: Request):
    authenticator=SDAuthentication()
    try:
        authorisations, user=await authenticator.authenticate(request=request)
    except CredentialsError:
        return{
            "error": WRONG_USERNAME_OR_PASSWORD_PROMPT
        }

    if "authenticated" not in authorisations.scopes:
        return{
            "error": NO_PERMISSIONS_PROMPT
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
        "firstName":user.firstName,
        "lastName":user.lastName,
        "department":user.department,
        "pathways":preparedPathways
    }