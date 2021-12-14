from authentication.authentication import LoginController
from .api import _FastAPI
from starlette.requests import Request
from pydantic import BaseModel

class LoginInput(BaseModel):
    username:str
    password:str

@_FastAPI.post("/login/")
async def login(request: Request):
    loginController=LoginController(model=await request.json())
    res=await loginController.login()
    return res