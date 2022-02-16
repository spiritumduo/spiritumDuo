import asyncio
import os
import logging
from random import randint
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse
from starlette.background import BackgroundTasks
from authentication import needs_authentication, PseudoAuth
from fastapi import FastAPI, Request
from datetime import date, datetime
from models import Patient, db
from asyncpg.exceptions import UniqueViolationError
from pydantic import BaseModel
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from models import TestResult
from typing import List, Optional, Union
from RecordTypes import TestResultState
from placeholder_data import TEST_RESULT_DATA
import httpx

log = logging.getLogger("uvicorn")
log.setLevel(logging.DEBUG)

SESSION_KEY = os.getenv("SESSION_SECRET_KEY")
UPDATE_ENDPOINT_KEY = os.getenv("UPDATE_ENDPOINT_KEY")

pseudotie_middleware = [
    Middleware(SessionMiddleware, secret_key=SESSION_KEY, session_cookie="SDSESSION", max_age=60*60*6),
    Middleware(AuthenticationMiddleware, backend=PseudoAuth())
]

app = FastAPI(middleware=pseudotie_middleware, debug=True)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str=None):
    return {"message": f"Hello {name}"}


class PatientInput(BaseModel):
    hospital_number: str
    national_number: str
    communication_method: str
    first_name: str
    last_name: str
    date_of_birth: date


@app.post("/patient/")
@needs_authentication
async def patient_post(request: Request, input: PatientInput):
    """
    Create patient
    :param _: Request - ignored
    :param input: PatientInput - patient data to input
    :return: JSONResponse of created patient
    """
    try:
        patient = await Patient.create(
            hospital_number=input.hospital_number,
            national_number=input.national_number,
            communication_method=input.communication_method,
            first_name=input.first_name,
            last_name=input.last_name,
            date_of_birth=input.date_of_birth,
        )
        return {
            "id":patient.id,
            "hospital_number":patient.hospital_number,
            "national_number":patient.national_number,
            "communication_method":patient.communication_method,
            "first_name":patient.first_name,
            "last_name":patient.last_name,
            "date_of_birth":patient.date_of_birth
        }
    except UniqueViolationError:
        return JSONResponse(status_code=409)


@app.get("/patient/hospital/{id}")
@needs_authentication
async def patient_hospital_id(request: Request, id: str):
    """
    Get patient by hospital number
    :param id: String ID
    :returns JSONResponse containing Patient or null
    """
    patient = await Patient.query.where(Patient.hospital_number == str(id)).gino.first()
    if patient is not None:
        return {
            "id":patient.id,
            "hospital_number":patient.hospital_number,
            "national_number":patient.national_number,
            "communication_method":patient.communication_method,
            "first_name":patient.first_name,
            "last_name":patient.last_name,
            "date_of_birth":patient.date_of_birth
        }
    else:
        return None


@app.post("/patient/hospital/")
@needs_authentication
async def patient_hospital_id(request: Request, input: List[str]):
    """
    Get patient by hospital number
    :param _: Request
    :param input: List of hospital numbers
    :returns JSONResponse containing Patient or null
    """
    patients = await Patient.query.where(Patient.hospital_number.in_(input)).gino.all()

    if patients is not None:
        res = []
        for patient in patients:
            res.append({
                "id": patient.id,
                "hospital_number": patient.hospital_number,
                "national_number": patient.national_number,
                "communication_method": patient.communication_method,
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "date_of_birth": patient.date_of_birth
            })
        return res
    else:
        return None


@app.get("/patient/national/{id}")
@needs_authentication
async def patient_national_id(request: Request, id: str):
    """
    Get patient by national number
    :param id: String ID
    :returns JSONResponse containing
    """
    patient = await Patient.query.where(Patient.national_number == str(id)).gino.first()
    return patient

async def proc_wrapper(func):
    loop = asyncio.get_event_loop()
    loop.create_task(func)

async def updateTestResultAtRandomTime(testResultId:int=None):
    # delay=randint(30, 60)
    delay=0
    await asyncio.sleep(delay)
    testResult=await TestResult.get(testResultId)

    # Generate test result description
    description=""
    if testResult.type_reference_name in TEST_RESULT_DATA:
        description=TEST_RESULT_DATA[testResult.type_reference_name]['result']
    else:
        log.warn(f"TYPE REFERENCE '{testResult.type_reference_name} HAS NO DESCRIPTION DEFINITION. DEFAULTING TO PLACEHOLDER TEXT")
        description="Vitae itaque illo ut. Non voluptatum aut qui porro dolores autem saepe."
    
    await testResult.update(
        current_state=TestResultState.COMPLETED,
        description=description
    ).apply()

    

    async with httpx.AsyncClient() as client:
        await client.post(
            url="http://sd-backend:8080/rest/testresult/update",
            json={
                "id":testResult.id,
                "new_state":TestResultState.COMPLETED.value
            },
            cookies={
                "SDTIEKEY": UPDATE_ENDPOINT_KEY
            }
        )


class TestResultRequest(BaseModel):
    currentState: Optional[str]
    typeReferenceName: str
    addedAt: Optional[datetime]
    updatedAt: Optional[datetime]
    description: Optional[str]

@app.post("/testresult")
@needs_authentication
async def create_test_result_post(request: Request, input: TestResultRequest):
    """
    Create test result
    :return: JSONResponse containing ID of created test result or error data
    """
    data={
        "type_reference_name": input.typeReferenceName
    }
    if input.currentState is not None:
        data["current_state"] = input.currentState
    if input.addedAt is not None:
        data["added_at"] = input.addedAt
    if input.updatedAt is not None:
        data["updated_at"] = input.updatedAt

    if input.description is None and (input.currentState is not None and input.currentState=="COMPLETED"):
        if input.typeReferenceName in TEST_RESULT_DATA:
            data["description"]=TEST_RESULT_DATA[input.typeReferenceName]['result']
        else:
            log.warn(f"TYPE REFERENCE '{input.typeReferenceName} HAS NO DESCRIPTION DEFINITION. DEFAULTING TO PLACEHOLDER TEXT")
            data["description"]="Vitae itaque illo ut. Non voluptatum aut qui porro dolores autem saepe."
    elif input.currentState is not None and input.currentState=="COMPLETED":
        data["description"] = input.description

    testResult:TestResult = await TestResult.create(
        **data
    )

    bg=BackgroundTasks()
    if "description" not in data:
        bg.add_task(proc_wrapper, updateTestResultAtRandomTime(testResultId=testResult.id))

    return JSONResponse({
        "id":testResult.id,
        "description": testResult.description,
        "type_reference_name":testResult.type_reference_name,
        "current_state":testResult.current_state.value,
        "added_at":testResult.added_at.isoformat(),
        "updated_at":testResult.updated_at.isoformat()
    }, background=bg)


@app.post("/testresults/get/")
@needs_authentication
async def get_test_results_post(request: Request, input: List[str]):
    """
    Get many test results via post request
    :param request:
    :param input:
    :return:
    """
    integerInput = [int(i) for i in input]
    testResults:Union[List[TestResult], None] = await TestResult.query.where(TestResult.id.in_(integerInput)).gino.all()

    if testResults is None: return None

    res = []
    for testResult in testResults:
        res.append({
            "id": testResult.id,
            "description": testResult.description,
            "type_reference_name": testResult.type_reference_name,
            "current_state": testResult.current_state,
            "added_at": testResult.added_at,
            "updated_at": testResult.updated_at
        })
    return res


@app.get("/testresult/{id}")
@needs_authentication
async def get_test_result_get(request: Request, id: str=None):
    """
    Get test result by ID
    :param id: String ID
    :return: JSONResponse containing TestResult requested or null
    """

    id=int(id)
    testResult:Union[TestResult, None] = await TestResult.query.where(TestResult.id==id).gino.one_or_none()
    
    if testResult is None: return None

    return {
        "id": testResult.id,
        "description": testResult.description,
        "type_reference_name": testResult.type_reference_name,
        "current_state": testResult.current_state,
        "added_at": testResult.added_at,
        "updated_at": testResult.updated_at
    }

db.init_app(app)
