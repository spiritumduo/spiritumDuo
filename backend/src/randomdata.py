from starlette.responses import PlainTextResponse
from models.User import User
from models.Patient import Patient
from models.Pathway import Pathway
from models.OnPathway import OnPathway
from random import randint
from datetime import date, datetime
from SdTypes import DecisionTypes


async def generate_random(request):
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()

    await Pathway.create(name="Lung Cancer")
    await Pathway.create(name="Bronchastasis")

    for i in range(0, 200):
        str_i = str(i)
        year = randint(1950, 1975)
        month = randint(1, 12)
        day = randint(1, 28)
        dob = date(year, month, day)
        await Patient.create(
            first_name="John " + str_i,
            last_name="Doe " + str_i,
            hospital_number="MRN1234567-" + str_i,
            national_number="NHS1234567-" + str_i,
            date_of_birth=dob,
            communication_method=DecisionTypes.TRIAGE.value
        )
    patients = await Patient.query.gino.all()
    pathways = await Pathway.query.gino.all()

    for p in patients:
        path = pathways[randint(0, 1)]
        await OnPathway.create(
            patient=p.id,
            pathway=path.id
        )



    return PlainTextResponse("OK")
