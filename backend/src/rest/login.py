from authentication.authentication import LoginController
from .api import _FastAPI
from starlette.requests import Request

@_FastAPI.post("/login/")
async def login(request: Request):
    loginController=LoginController(model=request)
    return await loginController.login()