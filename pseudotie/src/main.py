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
from models import Milestone, TestResult
from typing import List, Optional
from RecordTypes import MilestoneState
from placeholder_data import TEST_RESULT_DATA

log = logging.getLogger("uvicorn")
log.setLevel(logging.DEBUG)

SESSION_KEY = os.getenv("SESSION_SECRET_KEY")

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

async def updateMilestoneAtRandomTime(milestoneId:int=None):
    delay=randint(30, 60)
    await asyncio.sleep(delay)
    milestone=await Milestone.get(milestoneId)
    await milestone.update(current_state=MilestoneState.COMPLETED).apply()

    # Generate test results
    testResultDescription=""
    if milestone.type_reference_name in TEST_RESULT_DATA:
        testResultDescription=TEST_RESULT_DATA[milestone.type_reference_name]['result']
    else:
        testResultDescription="Lorem ipsum doner kebab"

    testResult=await TestResult.create(
        milestone_id=milestone.id,
        description=testResultDescription
    )

class MilestoneInput(BaseModel):
    currentState: Optional[str]
    typeReferenceName: str
    addedAt: Optional[datetime]
    updatedAt: Optional[datetime]

@app.post("/milestone")
@needs_authentication
async def post_milestone(request: Request, my_input: MilestoneInput):
    """
    Create Milestone
    :return: JSONResponse containing ID of created milestone or error data
    """
    milestoneData={
        "type_reference_name": my_input.typeReferenceName
    }
    if my_input.currentState is not None:
        milestoneData["current_state"] = my_input.currentState
    if my_input.addedAt is not None:
        milestoneData["added_at"] = my_input.addedAt
    if my_input.updatedAt is not None:
        milestoneData["updated_at"] = my_input.updatedAt

    milestone:Milestone = await Milestone.create(
        **milestoneData
    )

    bg=BackgroundTasks()
    bg.add_task(proc_wrapper, updateMilestoneAtRandomTime(milestone.id))

    return JSONResponse({
        "id":milestone.id,
        "type_reference_name":milestone.type_reference_name,
        "current_state":milestone.current_state.value,
        "added_at":milestone.added_at.isoformat(),
        "updated_at":milestone.updated_at.isoformat(),
        "test_result":{}
    }, background=bg)


@app.post("/milestones/get/")
@needs_authentication
async def milestones(request: Request, input: List[str]):
    """
    Get many milestones via post request
    :param request:
    :param input:
    :return:
    """
    integer_ids = [int(i) for i in input]

    milestones = await db.select([
        Milestone, 
        TestResult.id.label("test_result_id"),
        TestResult.added_at.label("test_result_added_at"),
        TestResult.description.label("test_result_description"),
    ]).select_from(Milestone.outerjoin(TestResult, Milestone.id==TestResult.milestone_id)).gino.all()

    if milestones is not None:
        res = []
        for milestone in milestones:
            res.append({
                "id": milestone.id,
                "current_state": milestone.current_state,
                "added_at": milestone.added_at,
                "updated_at": milestone.updated_at,
                "test_result":{
                    "id": milestone.test_result_id,
                    "added_at": milestone.test_result_added_at,
                    "description": milestone.test_result_description
                }
            })
        return res
    else:
        return None


@app.get("/milestone/{id}")
@needs_authentication
async def milestone_id(request: Request, id: str=None):
    """
    Get milestone by ID
    :param id: String ID
    :return: JSONResponse containing Milestone requested or null
    """

    try:
        id=int(id)
    except:
        pass
    else:
        milestone = await db.select([
            Milestone, 
            TestResult.id.label("test_result_id"),
            TestResult.added_at.label("test_result_added_at"),
            TestResult.description.label("test_result_description"),
        ]).select_from(Milestone.outerjoin(TestResult, Milestone.id==TestResult.milestone_id))\
            .where(Milestone.id==id)\
            .gino.all()
        if milestone:
            return {
                "id":milestone.id,
                "current_state":milestone.current_state,
                "added_at":milestone.added_at,
                "updated_at":milestone.updated_at,
                "test_result":{
                    "id": milestone.test_result_id,
                    "added_at": milestone.test_result_added_at,
                    "description": milestone.test_result_description
                }
            }
        else:
            return None

db.init_app(app)
