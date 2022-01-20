import json
import os

from time import sleep
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
    return {
        "id":patient.id,
        "hospital_number":patient.hospital_number,
        "national_number":patient.national_number,
        "communication_method":patient.communication_method,
        "first_name":patient.first_name,
        "last_name":patient.last_name,
        "date_of_birth":patient.date_of_birth
    }


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
async def post_milestone(hospitalNumber:str=None, currentState:str=None):
    """
    Create Milestone
    :return: JSONResponse containing ID of created milestone or error data
    """
    if currentState:
        data:Milestone = await Milestone.create(
            hospital_number=hospitalNumber,
            current_state=currentState
        )
    else:
        data:Milestone = await Milestone.create(
            hospital_number=hospitalNumber
        )
    return {
        "id":data.id,
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
    else:
        data:Milestone = await Milestone.query.where(Milestone.id==id).gino.one_or_none()
        if data:
            return {
                "id":data.id,
                "current_state":data.current_state,
                "added_at":data.added_at,
                "updated_at":data.updated_at,
            }
        else:
            return None

db.init_app(app)