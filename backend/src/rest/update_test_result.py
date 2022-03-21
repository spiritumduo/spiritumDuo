from containers import SDContainer
from .api import _FastAPI
from dependency_injector.wiring import Provide, inject
from fastapi import Request
from pydantic import BaseModel
from models import Milestone
from fastapi.responses import Response
from config import config


class TestResultUpdate(BaseModel):
    id: str = None
    new_state: str = None


@_FastAPI.post("/testresult/update")
@inject
async def update_test_result(
    request: Request, data: TestResultUpdate,
    pub=Provide[SDContainer.pubsub_service]
):
    if ('SDTIEKEY' not in request.cookies or
        request.cookies['SDTIEKEY'] != config['UPDATE_ENDPOINT_KEY'])\
            and config['TESTING'] is None:
        return Response(status_code=401)
    milestone = await Milestone.query.where(
        Milestone.test_result_reference_id == str(data.id)
    ).gino.one_or_none()
    await milestone.update(current_state=data.new_state).apply()
    await pub.publish('milestone-resolutions', milestone)
    return Response(status_code=200)
