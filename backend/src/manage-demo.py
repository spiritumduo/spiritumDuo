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
    await Session.delete.gino.status()
    await User.delete.where(User.username.like("%user%")).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()

async def insert_demo_data():
    general_milestone_types={
        "referral_letter": await MilestoneType.create(name="Referral letter", ref_name="Referral letter (record artifact)", is_checkbox_hidden=True),
        "pathology": await MilestoneType.create(name="Pathology", ref_name="Pathology report (record artifact)", is_checkbox_hidden=True),
        "prehad_referral": await MilestoneType.create(name="Prehad referral", ref_name="Prehabilitation (regime/therapy)", is_discharge=True),
        "dietician_referral": await MilestoneType.create(name="Dietician referral", ref_name="Patient referral to dietitian (procedure)", is_discharge=True),
        "smoking_cessation_referral": await MilestoneType.create(name="Smoking cessation referral", ref_name="Referral to smoking cessation service (procedure)"),
        "chest_xray": await MilestoneType.create(name="Chest X-ray", ref_name="Plain chest X-ray (procedure)"),
        "ct_chest": await MilestoneType.create(name="CT chest", ref_name="Computed tomography of chest (procedure)"),
    }

    selectable_milestone_types=[
        await MilestoneType.create(name="PET-CT", ref_name="Positron emission tomography with computed tomography (procedure)"),
        await MilestoneType.create(name="CT head - contrast", ref_name="Computed tomography of head with contrast (procedure)"),
        await MilestoneType.create(name="MRI head", ref_name="Magnetic resonance imaging of head (procedure)"),
        await MilestoneType.create(name="Lung function tests", ref_name="Measurement of respiratory function (procedure)"),
        await MilestoneType.create(name="ECHO", ref_name="Echocardiography (procedure)"),
        await MilestoneType.create(name="CT guided biopsy thorax", ref_name="Biopsy of thorax using computed tomography guidance (procedure)"),
        await MilestoneType.create(name="EBUS", ref_name="Transbronchial needle aspiration using endobronchial ultrasonography guidance (procedure)"),
        await MilestoneType.create(name="ECG", ref_name="Electrocardiogram analysis (qualifier value)"),
        await MilestoneType.create(name="Thoracoscopy", ref_name="Thoracoscopy (procedure)"),
        await MilestoneType.create(name="Bronchoscopy", ref_name="Bronchoscopy (procedure)"),
        await MilestoneType.create(name="Pleural tap", ref_name="Thoracentesis (procedure)"),
        await MilestoneType.create(name="CPET", ref_name=" Cardiopulmonary exercise test (procedure)"),
        await MilestoneType.create(name="Bloods", ref_name="Blood test (procedure)"),
    ]

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

        _pathway=await CreatePathway(
            context=_context,
            name=f"Lung Cancer demo {i}"
        )

        _user=await CreateUser(
            username=f"user{i}",
            password=f"21password{i}",
            first_name="Demo",
            last_name=f"User {i}",
            department="Demonstration",
            default_pathway_id=_pathway['pathway'].id
        )
        _context['request']['user']=User(
            id=_user["id"],
            username=_user['username'],
            department=_user['department'],
            first_name=_user['first_name'],
            last_name=_user['last_name'],
            default_pathway_id=_pathway['pathway'].id
        )
        print(f"Creating user {_user['username']}")

        hospital_number="fMRN" + str(randint(1000,9999))
        if len(str(i))==1:
            hospital_number+= "0"
        hospital_number+=str(i)

        national_number="fNHS" + str(randint(1000000,9999999))
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
                    "milestoneTypeId": general_milestone_types["referral_letter"].id,
                    "currentState": MilestoneState.COMPLETED
                },
                {
                    "milestoneTypeId": general_milestone_types["chest_xray"].id,
                    "currentState": MilestoneState.COMPLETED
                },
                {
                    "milestoneTypeId": general_milestone_types["ct_chest"].id,
                    "currentState": MilestoneState.COMPLETED
                }
            ]
        )

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(clear_existing_data())
loop.run_until_complete(insert_demo_data())