from .api import _FastAPI
from starlette.requests import Request
from authentication.logincontroller import LoginController
from models.db import db

@_FastAPI.post("/logout/")
async def logout(request: Request):
    loginController=LoginController(context={'db':db})
    return await loginController.logout(request)