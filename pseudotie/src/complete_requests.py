import os
import httpx
from models.db import db, DATABASE_URL
from models import TestResult, Patient
from asyncio import get_event_loop
from datetime import datetime
from RecordTypes import TestResultState
from main import getTestResultDescription

UPDATE_ENDPOINT_KEY = os.getenv("UPDATE_ENDPOINT_KEY")


async def cleanup():
    """
    This script is necessary to facilitate the updating of test
    results in the event that the system restarts or crashes so
    the thread tasked with immediately returning the data 
    cannot successfully complete. This script is run as a cron
    job because when the system recovers, there may be tests
    that need to be sent back immediately and some that aren't
    ready just yet
    """

    await db.set_bind(DATABASE_URL)

    testResultsWithPatient = await db.select(
        [TestResult, Patient.hospital_number]
    ).where(
        TestResult.planned_return_time < datetime.now()
    ).where(
        TestResult.current_state == TestResultState.INIT
    ).where(
        TestResult.patient_id == Patient.id
    ).gino.all()

    for record in testResultsWithPatient:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                url="http://sd-backend:8080/rest/testresult/update",
                json={
                    "id": record.id,
                    "new_state": TestResultState.COMPLETED.value
                },
                cookies={
                    "SDTIEKEY": UPDATE_ENDPOINT_KEY
                }
            )
            if res.status_code == 200:
                await TestResult.update.values(
                    description=getTestResultDescription(
                        typeName=record.type_reference_name,
                        hospitalNumber=record.hospital_number
                    ),
                    current_state=TestResultState.COMPLETED
                ).where(
                    TestResult.id == record.id
                ).gino.status()


loop = get_event_loop()
loop.run_until_complete(cleanup())
