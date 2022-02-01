import asyncio
import secrets
import string
from types import TracebackType
from faker import Faker
from sqlalchemy.exc import IntegrityError
from containers import SDContainer

from models.db import db, DATABASE_URL
from models import User, Pathway, Patient, OnPathway, DecisionPoint, Milestone, MilestoneType
from random import randint, getrandbits
from datetime import date, datetime
from SdTypes import DecisionTypes, MilestoneState
from datacreators import CreatePatient, CreateUser, CreateDecisionPoint
from itsdangerous import TimestampSigner
from config import config
from base64 import b64encode
from api import app
import traceback
app.container=SDContainer()

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

async def insert_user():
    users = await User.query.gino.all()
    user_num = str(len(users))
    username = "user" + user_num
    password = password_generator()
    first_name = "John " + user_num
    last_name = "Doe " + user_num
    department = "Respiratory"
    try:
        user = await CreateUser(username, password, first_name, last_name, department)
        print("User inserted")
        print("Username: " + user['username'])
        print("Password: " + password)

        # the return data from `CreateUser` is a dict so it can be
        # directly output via gql. To emulate the request class, 
        # we set this as a user object as it would be normally
        _CONTEXT['request']['user']=User(
            id=user["id"],
            username=user['username'],
            department=user['department'],
            first_name=user['first_name'],
            last_name=user['last_name']
        )
    except IntegrityError as err:
        print("Error: " + str(err))

async def insert_test_data():
    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()

    created_pathways=[
        await Pathway.create(name="Lung Cancer"),
        await Pathway.create(name="Bronchastasis")
    ]

    await MilestoneType.create(name="CT Thorax", ref_name="ref CT Thorax", ref_id="169069000")
    await MilestoneType.create(name="X-Ray Chest", ref_name="ref X-Ray Chest", ref_id="399208008")
    await MilestoneType.create(name="MRI Thorax", ref_name="ref MRI Thorax", ref_id="6007000")
    await MilestoneType.create(name="CT Head", ref_name="ref CT Head", ref_id="303653007")
    await MilestoneType.create(name="Bronchoscopy", ref_name="ref Bronchoscopy", ref_id="10847001")

    milestone_types = await MilestoneType.query.gino.all()
    _Faker=Faker()

    
    for i in range(0, 50):
        first_name=_Faker.first_name()
        last_name=_Faker.last_name()

        # this way of generating the identifiers makes
        # them look realistic/different whilst ensuring they're
        # all unique. Would need slightly changing if a 
        # triple digit range is used
        hospital_number="fMRN" + str(randint(10000,99999))
        if len(str(i))==1:
            hospital_number+= "0"
        hospital_number+=str(i)

        national_number="fNHS" + str(randint(10000000,99999999))
        if len(str(i))==1:
            national_number+= "0"
        national_number+=str(i)

        year = randint(1950, 1975)
        month = randint(1, 12)
        day = randint(1, 28)
        dob = date(year, month, day)
        try:
            await CreatePatient(
                context=_CONTEXT,
                first_name=first_name,
                last_name=last_name,
                hospital_number=hospital_number,
                national_number=national_number,
                date_of_birth=dob,
                communication_method="LETTER",
                pathwayId=created_pathways[randint(0, len(created_pathways)-1)].id
            )
            print(f"Creating patient: {first_name} {last_name}")
        except Exception as e:
            traceback.print_exc()
    patients = await Patient.query.gino.all()
    pathways = await Pathway.query.gino.all()

    d_types = [
        DecisionTypes.TRIAGE,
        DecisionTypes.CLINIC,
        DecisionTypes.AD_HOC,
        DecisionTypes.MDT,
        DecisionTypes.POST_REQUEST,
    ]

    lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante."
    user = await User.query.gino.first()
    for p in patients:
        path = pathways[randint(0, 1)]
        d_t = d_types[randint(0, 1)]
        referDay = randint(1, 10)
        referMonth = randint(1, 10)
        referYear = 2021
        on_pathway = await OnPathway.create(
            patient_id=p.id,
            pathway_id=path.id,
            awaiting_decision_type=d_t,
            referred_at=datetime(referYear, referMonth, referDay)
        )

        num_decisions = randint(1, 2)
        decisionDay = referDay + randint(1, 7)
        decisionMonth = referMonth
        decisionYear = referYear


        milestones_to_add_to_decision_point=[]
        num_milestones = randint(2, 5)
        for i in range(0, num_milestones):
            current_state = MilestoneState.WAITING
            updated_at = datetime(decisionYear, decisionMonth, decisionDay)
            if num_decisions == 2:
                current_state = MilestoneState.COMPLETED
                updated_at = datetime(decisionYear, decisionMonth, decisionDay + randint(1, 7))
            elif randint(0, 1) == 1:
                current_state = MilestoneState.COMPLETED
                updated_at = datetime(decisionYear, decisionMonth, decisionDay + randint(1, 7))
            
            milestones_to_add_to_decision_point.append({
                "milestoneTypeId":milestone_types[i].id,
                "currentState":current_state,
                "addedAt":datetime(decisionYear, decisionMonth, decisionDay),
                "updatedAt":updated_at
            })

        dp=await CreateDecisionPoint(
            context=_CONTEXT,
            clinician_id=_CONTEXT['request']['user'].id,
            on_pathway_id=on_pathway.id,
            decision_type=DecisionTypes.TRIAGE,
            clinic_history=lorem,
            comorbidities=lorem,
            added_at=datetime(decisionYear, decisionMonth, decisionDay),
            milestone_requests=milestones_to_add_to_decision_point
        )
        
        if num_decisions == 2:
            decisionMonth += 1
            milestones_to_add_to_decision_point=[]
            num_milestones = randint(2, 5)
            for i in range(0, num_milestones):
                current_state = MilestoneState.WAITING
                updated_at = datetime(decisionYear, decisionMonth, decisionDay)
                if randint(0, 1) == 1:
                    current_state = MilestoneState.COMPLETED
                    updated_at = datetime(decisionYear, decisionMonth, decisionDay + randint(1, 7))

                milestones_to_add_to_decision_point.append({
                    "milestoneTypeId":milestone_types[i].id,
                    "currentState":current_state,
                    "addedAt":datetime(decisionYear, decisionMonth, decisionDay),
                    "updatedAt":updated_at
                })

            await CreateDecisionPoint(
                context=_CONTEXT,
                clinician_id=_CONTEXT['request']['user'].id,
                on_pathway_id=on_pathway.id,
                decision_type=DecisionTypes.CLINIC,
                clinic_history=lorem,
                comorbidities=lorem,
                added_at=datetime(decisionYear, decisionMonth, decisionDay),
                milestone_requests=milestones_to_add_to_decision_point
            )


loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(insert_user())
loop.run_until_complete(insert_test_data())
