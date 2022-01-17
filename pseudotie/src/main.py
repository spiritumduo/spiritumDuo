import json

from fastapi import FastAPI, Request
from datetime import date
from models import Patient, db
from asyncpg.exceptions import UniqueViolationError
from pydantic import BaseModel
from starlette.responses import JSONResponse

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


class PatientInput(BaseModel):
    hospital_number: str
    national_number: str
    communication_method: str
    first_name: str
    last_name: str
    date_of_birth: date


@app.post("/patient/")
async def patient_post(_: Request, input: PatientInput):
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
async def patient_hospital_id(id: str):
    """
    Get patient by hospital number
    :param id: String ID
    :returns JSONResponse containing Patient or null
    """
    patient = await Patient.query.where(Patient.hospital_number == str(id)).gino.first()
    return patient


@app.get("/patient/national/{id}")
async def patient_national_id(id: str):
    """
    Get patient by national number
    :param id: String ID
    :returns JSONResponse containing
    """
    patient = await Patient.query.where(Patient.national_number == str(id)).gino.first()
    return patient


@app.post("/milestone")
async def post_milestone():
    """
    Create Milestone
    :return: JSONResponse containing ID of created milestone or error data
    """
    pass


@app.get("/milestone/{id}")
async def milestone_id(id: str):
    """
    Get milestone by ID
    :param id: String ID
    :return: JSONResponse containing Milestone requested or null
    """
    pass


db.init_app(app)


