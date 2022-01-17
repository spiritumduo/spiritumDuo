from fastapi import FastAPI
from starlette.responses import JSONResponse

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/patient/hospital/{id}")
async def patient_hospital_id(id: str):
    """
    Get patient by hospital number
    :param id: String ID
    :returns JSONResponse containing Patient or null
    """
    pass


@app.get("/patient/national/{id}")
async def patient_national_id(id: str):
    """
    Get patient by national number
    :param id: String ID
    :returns JSONResponse containing
    """
    pass


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


