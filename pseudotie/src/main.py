import json
import os

from starlette.middleware.sessions import SessionMiddleware
from authentication import needs_authentication, PseudoAuth
from fastapi import FastAPI, Request
from datetime import date
from models import Patient, db
from asyncpg.exceptions import UniqueViolationError
from pydantic import BaseModel
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from models import Milestone
from typing import List

SESSION_KEY = os.getenv("SESSION_SECRET_KEY")

pseudotie_middleware = [
    Middleware(SessionMiddleware, secret_key=SESSION_KEY, session_cookie="SDSESSION", max_age=60*60*6),
    Middleware(AuthenticationMiddleware, backend=PseudoAuth())
]

app = FastAPI(middleware=pseudotie_middleware)


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
        return patient
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
    return patient


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


@app.post("/milestone")
async def post_milestone(hospitalNumber:str=None, milestoneReference:str=None):
    """
    Create Milestone
    :return: JSONResponse containing ID of created milestone or error data
    """
    data:Milestone = await Milestone.create(
        patient_hospital_number=hospitalNumber,
        milestone_reference=milestoneReference
    )
    return {
        "id":data.id,
        "patient_hospital_number":data.patient_hospital_number,
        "milestone_reference":data.milestone_reference,
        "current_state":data.current_state,
        "added_at":data.added_at,
        "updated_at":data.updated_at,
    }


@app.get("/milestone/{id}")
async def milestone_id(id: str=None):
    """
    Get milestone by ID
    :param id: String ID
    :return: JSONResponse containing Milestone requested or null
    """

    try:
        id=int(id)
    except:
        pass

    try:
        id=json.loads(id)
    except:
        pass

    if id is not int and id is not List:
        raise TypeError


    if id is int:
        data:Milestone = await Milestone.query.where(Milestone.id==id).gino.one_or_none()
        if data:
            return {
                "id":data.id,
                "patient_hospital_number":data.patient_hospital_number,
                "milestone_reference":data.milestone_reference,
                "current_state":data.current_state,
                "added_at":data.added_at,
                "updated_at":data.updated_at,
            }
        else:
            return None
    elif id is List:
        data:Milestone = await Milestone.query.where(Milestone.id.in_(id)).gino.one_or_none()
        returnData:List=[]
        for entry in data:
            returnData.append({
                "id":entry.id,
                "patient_hospital_number":entry.patient_hospital_number,
                "milestone_reference":entry.milestone_reference,
                "current_state":entry.current_state,
                "added_at":entry.added_at,
                "updated_at":entry.updated_at,
            })
        return returnData

db.init_app(app)