import asyncio
from models import *
from datacreators import *
from containers import SDContainer
from models.db import db, DATABASE_URL
from api import app
from faker import Faker
from random import randint, getrandbits
from datetime import date, datetime
from SdTypes import MilestoneState
from itsdangerous import TimestampSigner
from config import config
from base64 import b64encode

faker=Faker()
app.container=SDContainer()


NUMBER_OF_USERS=5

class RequestPlaceholder(dict):
    pass


async def clear_existing_data():
    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()
    await User.delete.where(User.username.like("%user%")).gino.status()

async def insert_demo_data():
    created_milestone_types={
        "referralLetter": await MilestoneType.create(name="Referral letter", ref_name="Referral letter (record artifact)"),
        "ctThorax": await MilestoneType.create(name="CT Thorax", ref_name="Computed tomography of chest (procedure)"),
        "xRayChest": await MilestoneType.create(name="X-Ray Chest", ref_name="Plain chest X-ray (procedure)"),
        "mriHead": await MilestoneType.create(name="MRI Head", ref_name="Magnetic resonance imaging of head (procedure)"),
        "ctHeadWithContrast": await MilestoneType.create(name="CT Head - Contrast", ref_name="Computed tomography of head with contrast (procedure)"),
        "bronchoscopy": await MilestoneType.create(name="Bronchoscopy", ref_name="Bronchoscopy (procedure)")
    }

    _context={
        "db": db,
        "request": RequestPlaceholder()
    }

    signer=TimestampSigner(config['SESSION_SECRET_KEY'])
    cookie=signer.sign(b64encode(str(getrandbits(64)).encode("utf-8")))
    _context['request'].cookies={
        "SDSESSION":cookie.decode("utf-8")
    }

    for i in range(1, NUMBER_OF_USERS+1):

        _user=await CreateUser(
            username=f"user{i}",
            password=f"21password{i}",
            first_name="Demo",
            last_name=f"User {i}",
            department="Demonstration"
        )
        _context['request']['user']=User(
            id=_user["id"],
            username=_user['username'],
            department=_user['department'],
            first_name=_user['first_name'],
            last_name=_user['last_name']
        )

        print(f"Creating user {_user['username']}")

        _pathway=await CreatePathway(
            context=_context,
            name=f"Lung Cancer demo {i}"
        )


        hospital_number="fMRN" + str(randint(10000,99999))
        if len(str(i))==1:
            hospital_number+= "0"
        hospital_number+=str(i)

        national_number="fNHS" + str(randint(10000000,99999999))
        if len(str(i))==1:
            national_number+= "0"
        national_number+=str(i)

        date_of_birth = date(randint(1950, 1975), randint(1, 12), randint(1, 27))

        _patient=await CreatePatient(
            context=_context,
            first_name=faker.first_name(),
            last_name=faker.last_name(),
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth,
            pathwayId=_pathway['pathway'].id,
            milestones=[
                {
                    "milestoneTypeId": created_milestone_types["referralLetter"].id,
                    "currentState": MilestoneState.COMPLETED
                },
                {
                    "milestoneTypeId": created_milestone_types["xRayChest"].id,
                    "currentState": MilestoneState.COMPLETED
                },
                {
                    "milestoneTypeId": created_milestone_types["ctThorax"].id,
                    "currentState": MilestoneState.COMPLETED
                }
            ]
        )

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(clear_existing_data())
loop.run_until_complete(insert_demo_data())