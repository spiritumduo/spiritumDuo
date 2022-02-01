from xmlrpc.client import ResponseError
from .api import _FastAPI
from fastapi import Request
from pydantic import BaseModel
from models import Milestone
from fastapi.responses import JSONResponse, Response
from config import config

class TestResultUpdate(BaseModel):
    id:str=None
    new_state:str=None

@_FastAPI.post("/testresult/update")
async def update_test_result(request:Request, data:TestResultUpdate):
    if 'SDTIEKEY' in request.cookies and request.cookies['SDTIEKEY']!=config['UPDATE_ENDPOINT_KEY']:
        return Response(status_code=401)
    milestone=await Milestone.query.where(Milestone.reference_id==int(data.id)).gino.one_or_none()
    await milestone.update(current_state=data.new_state).apply()
    return Response(status_code=200)