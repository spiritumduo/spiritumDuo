from datetime import datetime
from containers import SDContainer
from .api import _FastAPI
from dependency_injector.wiring import Provide, inject
from fastapi import Request
from pydantic import BaseModel
from models import ClinicalRequest, OnPathway
from fastapi.responses import Response
from config import config
from SdTypes import ClinicalRequestState

class TestResultUpdate(BaseModel):
    id: str = None
    new_state: str = None


@_FastAPI.post("/testresult/update")
@inject
async def update_test_result(
    request: Request, data: TestResultUpdate,
    pub=Provide[SDContainer.pubsub_service]
):
    if ('SDTIEKEY' not in request.cookies
            or request.cookies['SDTIEKEY'] != config['UPDATE_ENDPOINT_KEY']):
        return Response(status_code=401)
    
    clinical_request: ClinicalRequest = await ClinicalRequest.query.where(
        ClinicalRequest.test_result_reference_id == str(data.id)
    ).gino.one_or_none()

    if data.new_state == ClinicalRequestState.COMPLETED:
        await clinical_request.update(
            current_state=data.new_state,
            completed_at=datetime.now()
        ).apply()
    else:
        await clinical_request.update(
            current_state=data.new_state,
            completed_at=datetime.now()
        ).apply()
    
    await pub.publish(
        'on-pathway-updated',
        await OnPathway.get(ClinicalRequest.on_pathway_id)
    )

    await pub.publish('clinical_request-resolutions', clinical_request)
    
    return Response(status_code=200)
