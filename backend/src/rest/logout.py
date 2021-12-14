from .api import _FastAPI
from starlette.requests import Request
from authentication.authentication import LoginController


@_FastAPI.post("/logout/")
async def logout(request: Request):
    loginController=LoginController(model=request)
    return await loginController.logout()


# async def login(request: Request):
#     if request['session']:
        # async with db.acquire(reuse=False) as conn:
        #     session=Session.delete.where(Session.session_key==request['session'])
        #     await conn.scalar(session)
        #     request.scope['session']=None
        #     return{
        #         "success"
        #     }
#     else:
#         return {
#             "error":"No active session found"
#         }