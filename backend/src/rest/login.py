from models.db import db
from .api import _FastAPI
from starlette.requests import Request
from authentication.logincontroller import LoginController

@_FastAPI.post("/login/")
async def login(request: Request):
    loginController=LoginController(context={'db':db})
    return await loginController.login(request)

    ## this is a test