import asyncio

from common import DataCreatorInputErrors
from models import *
from datacreators import *
from containers import SDContainer
from models.db import db, DATABASE_URL
from api import app
from faker import Faker
from random import randint, getrandbits
from datetime import date
from SdTypes import MilestoneState
from itsdangerous import TimestampSigner
from trustadapter.trustadapter import TrustIntegrationCommunicationError, PseudoTrustAdapter
from config import config
from base64 import b64encode
from typing import Dict, List

faker=Faker()
app.container=SDContainer()


NUMBER_OF_USERS=99

class RequestPlaceholder(dict):
    pass

_CONTEXT={
    "db": db,
    "request":RequestPlaceholder()
}

signer=TimestampSigner(config['SESSION_SECRET_KEY'])
cookie=signer.sign(b64encode(str(getrandbits(64)).encode("utf-8")))
_CONTEXT['request'].cookies={
    "SDSESSION":cookie.decode("utf-8")
}

async def check_connection():
    print("Testing connection...")
    try:
        await PseudoTrustAdapter().test_connection(auth_token=_CONTEXT['request'].cookies['SDSESSION'])
    except TrustIntegrationCommunicationError as e:
        print(e)
        print("Connection failed!")
        raise SystemExit()
    else:
        print("Connection successful!")

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
    general_milestone_types:Dict[str, MilestoneType]={
        "referral_letter": await MilestoneType.create(name="Referral letter", ref_name="Referral letter (record artifact)", is_checkbox_hidden=True),
        "pathology": await MilestoneType.create(name="Pathology", ref_name="Pathology report (record artifact)", is_checkbox_hidden=True),
        "prehab_referral": await MilestoneType.create(name="Prehab referral", ref_name="Prehabilitation (regime/therapy)"),
        "dietician_referral": await MilestoneType.create(name="Dietician referral", ref_name="Patient referral to dietitian (procedure)"),
        "smoking_cessation_referral": await MilestoneType.create(name="Smoking cessation referral", ref_name="Referral to smoking cessation service (procedure)"),
        "chest_xray": await MilestoneType.create(name="Chest X-ray", ref_name="Plain chest X-ray (procedure)", is_test_request=True),
        "ct_chest": await MilestoneType.create(name="CT chest", ref_name="Computed tomography of chest (procedure)", is_test_request=True),
        "ref_to_surgery": await MilestoneType.create(name="Refer to surgeons", ref_name="ref Surgeons", is_discharge=True),
        "ref_to_oncology": await MilestoneType.create(name="Refer to oncology", ref_name="ref Oncology", is_discharge=True),
        "ref_to_palliative": await MilestoneType.create(name="Refer to palliation", ref_name="ref Palliation", is_discharge=True),
        "discharge": await MilestoneType.create(name="Discharge", ref_name="ref Discharge", is_discharge=True),
        "mdt": await MilestoneType.create(name="Add to MDT", ref_name="Assessment by multidisciplinary team (procedure)"),
        "clinic": await MilestoneType.create(name="Book clinic appointment", ref_name="Appointment (record artifact)")
    }

    selectable_milestone_types:List[MilestoneType]=[
        await MilestoneType.create(name="PET-CT", ref_name="Positron emission tomography with computed tomography (procedure)", is_test_request=True),
        await MilestoneType.create(name="CT head - contrast", ref_name="Computed tomography of head with contrast (procedure)", is_test_request=True),
        await MilestoneType.create(name="MRI head", ref_name="Magnetic resonance imaging of head (procedure)", is_test_request=True),
        await MilestoneType.create(name="Lung function tests", ref_name="Measurement of respiratory function (procedure)", is_test_request=True),
        await MilestoneType.create(name="ECHO", ref_name="Echocardiography (procedure)", is_test_request=True),
        await MilestoneType.create(name="CT guided biopsy thorax", ref_name="Biopsy of thorax using computed tomography guidance (procedure)", is_test_request=True),
        await MilestoneType.create(name="EBUS", ref_name="Transbronchial needle aspiration using endobronchial ultrasonography guidance (procedure)", is_test_request=True),
        await MilestoneType.create(name="ECG", ref_name="Electrocardiogram analysis (qualifier value)", is_test_request=True),
        await MilestoneType.create(name="Thoracoscopy", ref_name="Thoracoscopy (procedure)", is_test_request=True),
        await MilestoneType.create(name="Bronchoscopy", ref_name="Bronchoscopy (procedure)", is_test_request=True),
        await MilestoneType.create(name="Pleural tap", ref_name="Thoracentesis (procedure)", is_test_request=True),
        await MilestoneType.create(name="CPET", ref_name="Cardiopulmonary exercise test (procedure)", is_test_request=True),
        await MilestoneType.create(name="Bloods", ref_name="Blood test (procedure)", is_test_request=True),
    ]

    for i in range(1, NUMBER_OF_USERS+1):
        _pathway:Pathway=await CreatePathway(
            context=_CONTEXT,
            name=f"Lung Cancer demo {i}"
        )

        _user:User=await CreateUser(
            username=f"user{i}",
            password=f"21password{i}",
            first_name="Demo",
            last_name=f"User {i}",
            department="Demonstration",
            default_pathway_id=_pathway.id
        )
        _CONTEXT['request']['user']=_user

        print(f"Creating user {_user.username}")

        hospital_number="fMRN" + str(randint(1000,9999))
        if len(str(i))==1:
            hospital_number+= "0"
        hospital_number+=str(i)

        national_number="fNHS" + str(randint(1000000,9999999))
        if len(str(i))==1:
            national_number+= "0"
        national_number+=str(i)

        date_of_birth = date(randint(1950, 1975), randint(1, 12), randint(1, 27))

        res = await CreatePatient(
            context=_CONTEXT,
            first_name=faker.first_name(),
            last_name=faker.last_name(),
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth,
            pathwayId=_pathway.id,
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
        if isinstance(res, DataCreatorInputErrors):
            for error in res.errorList:
                print(error)

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(check_connection())
loop.run_until_complete(clear_existing_data())
loop.run_until_complete(insert_demo_data())
