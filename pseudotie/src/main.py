import json
import os

from time import sleep
from starlette.middleware.sessions import SessionMiddleware
from authentication import needs_authentication, PseudoAuth
from fastapi import FastAPI, Request
from datetime import date, datetime
from models import Patient, db
from asyncpg.exceptions import UniqueViolationError
from pydantic import BaseModel, ValidationError
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.authentication import AuthenticationMiddleware
from models import Milestone
from typing import List, Union

import logging

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
async def patient_hospital_id(request: Request, input: list[str]):
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


@app.post("/milestone")
async def post_milestone(currentState:str=None, addedAt:datetime=None, updatedAt:datetime=None):
    """
    Create Milestone
    :return: JSONResponse containing ID of created milestone or error data
    """
    milestoneData={}
    if currentState:
        milestoneData["current_state"]=currentState
    if addedAt:
        milestoneData["added_at"]=addedAt
    if updatedAt:
        milestoneData["updated_at"]=updatedAt

    milestone:Milestone = await Milestone.create(
        **milestoneData
    )

    return {
        "id":milestone.id,
        "current_state":milestone.current_state,
        "added_at":milestone.added_at,
        "updated_at":milestone.updated_at,
    }


@app.post("/milestones/get/")
@needs_authentication
async def milestones(request: Request, input: list[str]):
    """
    Get many milestones via post request
    :param request:
    :param input:
    :return:
    """
    integer_ids = [int(i) for i in input]
    m_stones = await Milestone.query.where(Milestone.id.in_(integer_ids)).gino.all()
    if m_stones is not None:
        res = []
        for data in m_stones:
            res.append({
                "id": data.id,
                "current_state": data.current_state,
                "added_at": data.added_at,
                "updated_at": data.updated_at,
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
