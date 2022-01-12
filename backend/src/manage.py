import asyncio
import secrets
import string

from sqlalchemy.exc import IntegrityError

from models.db import db, DATABASE_URL
from models import User, Pathway, Patient, OnPathway, DecisionPoint, Milestone, MilestoneType
from random import randint
from datetime import date
from SdTypes import DecisionTypes, MilestoneState

from datacreators import CreateUser


# Generate random 8 character password from [a-zA-Z0-9]
def password_generator():
    chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(12))


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
    except IntegrityError as err:
        print("Error: " + str(err))


async def insert_test_data():
    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()

    await Pathway.create(name="Lung Cancer")
    await Pathway.create(name="Bronchastasis")

    await MilestoneType.create(name="CT Thorax", ref_name="ref CT Thorax")
    await MilestoneType.create(name="X-Ray Chest", ref_name="ref X-Ray Chest")
    await MilestoneType.create(name="MRI Thorax", ref_name="ref MRI Thorax")
    await MilestoneType.create(name="CT Head", ref_name="ref CT Head")
    await MilestoneType.create(name="Bronchoscopy", ref_name="ref Bronchoscopy")

    milestone_types = await MilestoneType.query.gino.all()

    for i in range(0, 50):
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
            communication_method="LETTER"
        )
    patients = await Patient.query.gino.all()
    pathways = await Pathway.query.gino.all()

    d_types = [
        DecisionTypes.TRIAGE.value,
        DecisionTypes.CLINIC.value,
        DecisionTypes.AD_HOC.value,
        DecisionTypes.MDT.value,
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
            referred_at=date(referYear, referMonth, referDay)
        )

        num_decisions = randint(1, 2)

        decisionDay = referDay + randint(1, 7)
        decisionMonth = referMonth
        decisionYear = referYear
        dp = await DecisionPoint.create(
            clinician_id=user.id,
            on_pathway_id=on_pathway.id,
            decision_type=DecisionTypes.TRIAGE.value,
            clinic_history=lorem,
            comorbidities=lorem,
            added_at=date(decisionYear, decisionMonth, decisionDay)
        )

        num_milestones = randint(2, 5)
        for i in range(0, num_milestones):
            current_state = MilestoneState.WAITING.value
            updated_at = date(decisionYear, decisionMonth, decisionDay)
            if num_decisions == 2:
                current_state = MilestoneState.COMPLETED.value
                updated_at = date(decisionYear, decisionMonth, decisionDay + randint(1, 7))
            elif randint(0, 1) == 1:
                current_state = MilestoneState.COMPLETED.value
                updated_at = date(decisionYear, decisionMonth, decisionDay + randint(1, 7))
            await Milestone.create(
                milestone_type_id=milestone_types[i].id,
                decision_point_id=dp.id,
                added_at=date(decisionYear, decisionMonth, decisionDay),
                current_state=current_state,
                updated_at=updated_at
            )

        if num_decisions == 2:
            decisionMonth += 1
            dp = await DecisionPoint.create(
                clinician_id=user.id,
                on_pathway_id=on_pathway.id,
                decision_type=DecisionTypes.CLINIC.value,
                clinic_history=lorem,
                comorbidities=lorem,
                added_at=date(decisionYear, decisionMonth, decisionDay)
            )

            num_milestones = randint(2, 5)
            for i in range(0, num_milestones):
                current_state = MilestoneState.WAITING.value
                updated_at = date(decisionYear, decisionMonth, decisionDay)
                if randint(0, 1) == 1:
                    current_state = MilestoneState.COMPLETED.value
                    updated_at = date(decisionYear, decisionMonth, decisionDay + randint(1, 7))
                await Milestone.create(
                    milestone_type_id=milestone_types[i].id,
                    decision_point_id=dp.id,
                    added_at=date(decisionYear, decisionMonth, decisionDay),
                    current_state=current_state,
                    updated_at=updated_at
                )


loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(insert_user())
