import asyncio
import secrets
import string
from faker import Faker
from sqlalchemy.exc import IntegrityError
from trustadapter.trustadapter import Patient_IE, TrustIntegrationCommunicationError, PseudoTrustAdapter
from containers import SDContainer
from models.db import db, DATABASE_URL
from models import *
from random import randint, getrandbits
from datetime import date
from SdTypes import DecisionTypes, MilestoneState
from datacreators import CreatePatient, CreateUser, CreateDecisionPoint
from itsdangerous import TimestampSigner
from config import config
from base64 import b64encode
from api import app
from typing import Union, List, Dict
app.container=SDContainer()

created_pathways=[]


# Generate random 8 character password from [a-zA-Z0-9]
def password_generator():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(12))

# a class that has the properties of a dictionary too
# this is to emulate how Starlette's request class
# operates, as context has to be passed to some functions
# to get the db connection and user objects
class RequestPlaceholder(dict):
    pass

_CONTEXT={
    "db": db,
    "request":RequestPlaceholder()
}

# this generates a placeholder cookie for use when connecting
# to the TIE as it's the only way to do so in one script w/
# authentication enabled
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

async def insert_user():
    global created_pathways

    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Session.delete.gino.status()
    await User.delete.where(User.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()

    created_pathways=[
        await Pathway.create(id=1, name="Lung Cancer"),
        await Pathway.create(id=2, name="Bronchiectasis")
    ]

    users = await User.query.gino.all()
    user_num = str(len(users))
    username = "user" + user_num
    password = password_generator()
    first_name = "John " + user_num
    last_name = "Doe " + user_num
    department = "Respiratory"
    default_pathway_id = 1
    try:
        user:User = await CreateUser(username, password, first_name, last_name, department, default_pathway_id)
        print("User inserted")
        print("Username: " + user.username)
        print("Password: " + password)

        _CONTEXT['request']['user']=user
    except IntegrityError as err:
        print("Error: " + str(err))

async def insert_test_data():
    _Faker:Faker=Faker()

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
    
    for i in range(0, 50):
        first_name=_Faker.first_name()
        last_name=_Faker.last_name()

        hospital_number="fMRN" + str(randint(1000,9999))
        if len(str(i))==1:
            hospital_number+= "0"
        hospital_number+=str(i)

        national_number="fNHS" + str(randint(1000000,9999999))
        if len(str(i))==1:
            national_number+= "0"
        national_number+=str(i)

        year = randint(1950, 1975)
        month = randint(1, 12)
        day = randint(1, 28)
        dob = date(year, month, day)

        _patientObject:Patient_IE = await CreatePatient(
            context=_CONTEXT,
            first_name=first_name,
            last_name=last_name,
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=dob,
            communication_method="LETTER",
            pathwayId=created_pathways[0].id,
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

        on_pathways:Union[List[OnPathway], None]={
            await OnPathway.query.where(
                OnPathway.patient_id==_patientObject.id
            ).where(
                OnPathway.pathway_id==created_pathways[0].id
            ).gino.one_or_none(),
            await OnPathway.create(
                patient_id = _patientObject.id,
                pathway_id = created_pathways[1].id
            )
        }

        on_pathway_counter=0
        for on_pathway in on_pathways:
            on_pathway_counter=on_pathway_counter+1
            if on_pathway_counter==1 or (on_pathway_counter!=1 and bool(getrandbits(1))):
                is_patient_new=bool(getrandbits(1))
                """
                    is the patient new to the pathway? if they are, we don't
                    want to add any decision points as they will need to be triaged
                """
                if not is_patient_new:
                    await on_pathway.update(
                        under_care_of_id=_CONTEXT["request"]["user"].id
                    ).apply()

                    number_of_milestones=randint(1,2)
                    possible_milestone_types=[
                        selectable_milestone_types[randint(0, len(selectable_milestone_types)-1)],
                        selectable_milestone_types[randint(0, len(selectable_milestone_types)-1)]
                    ]

                    while (possible_milestone_types[0]==possible_milestone_types[1]):
                        possible_milestone_types[1]=selectable_milestone_types[randint(0, len(selectable_milestone_types)-1)]
                    milestone_requests=[]
                    for i in range(0, number_of_milestones):
                        milestone_requests.append(
                            {"milestoneTypeId": possible_milestone_types[i].id}
                        )
                    
                    await CreateDecisionPoint(
                        context=_CONTEXT,
                        on_pathway_id=on_pathway.id,
                        clinician_id=_CONTEXT["request"]["user"].id,
                        decision_type=DecisionTypes.TRIAGE,
                        clinic_history=_Faker.text(),
                        comorbidities=_Faker.text(),
                        milestone_requests=milestone_requests
                    )
                    await on_pathway.update(
                        awaiting_decision_type=DecisionTypes.CLINIC
                    ).apply()

                    has_clinic=bool(getrandbits(1))
                    if has_clinic:
                        await CreateDecisionPoint(
                            context=_CONTEXT,
                            on_pathway_id=on_pathway.id,
                            clinician_id=_CONTEXT["request"]["user"].id,
                            decision_type=DecisionTypes.CLINIC,
                            clinic_history=_Faker.text(),
                            comorbidities=_Faker.text(),
                            milestone_requests=[
                                {"milestoneTypeId": selectable_milestone_types[randint(0, len(selectable_milestone_types)-1)].id}
                            ]
                        )
                        await on_pathway.update(
                            awaiting_decision_type=DecisionTypes.MDT
                        ).apply()

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(check_connection())
loop.run_until_complete(insert_user())
loop.run_until_complete(insert_test_data())
