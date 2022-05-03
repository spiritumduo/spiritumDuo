import asyncio
from common import DataCreatorInputErrors
from models import (
    Pathway,
    Patient,
    DecisionPoint,
    Milestone,
    MilestoneType,
    User,
    Session,
    OnPathway,
    Role,
    RolePermission, UserRole,
    PathwayMilestoneType
)
from containers import SDContainer
from models.db import db, DATABASE_URL
from api import app
from faker import Faker
from random import randint, getrandbits
from datetime import date
from SdTypes import MilestoneState, Permissions
from itsdangerous import TimestampSigner
from trustadapter.trustadapter import (
    Patient_IE,
    TestResult_IE,
    TestResultRequest_IE,
    TrustIntegrationCommunicationError,
    PseudoTrustAdapter
)
from config import config
from base64 import b64encode
from typing import Dict, List
from bcrypt import hashpw, gensalt

faker = Faker()
app.container = SDContainer()


NUMBER_OF_USERS_PER_PATHWAY = 10
NUMBER_OF_PATHWAYS = 1
NUMBER_OF_PATIENTS_PER_PATHWAY = 30


class RequestPlaceholder(dict):
    """
    This is a test
    """


_CONTEXT = {
    "db": db,
    "request": RequestPlaceholder()
}

signer = TimestampSigner(config['SESSION_SECRET_KEY'])
random_cookie_value = b64encode(str(getrandbits(64)).encode("utf-8"))
SESSION_COOKIE = signer.sign(random_cookie_value).decode("utf-8")

_CONTEXT['request'].cookies = {
    "SDSESSION": SESSION_COOKIE
}


async def check_connection():
    print("Testing connection...")
    try:
        await PseudoTrustAdapter().test_connection(
            auth_token=_CONTEXT['request'].cookies['SDSESSION']
        )
    except TrustIntegrationCommunicationError as e:
        print(e)
        print("Connection failed!")
        raise SystemExit()
    else:
        print("Connection successful!")


async def clear_existing_data():
    print("Clearing existing data from local database")
    await UserRole.delete.gino.status()
    await RolePermission.delete.gino.status()
    await Role.delete.gino.status()
    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Session.delete.gino.status()
    await User.delete.where(User.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await PathwayMilestoneType.delete.where(MilestoneType.id >= 0).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()
    print("********************")
    print("\33[31mNOTE: you may need to clear the `PSEUDOTIE` database in")
    print("the event of HTTP 409 (conflict)\33[0m")
    print("********************")
    await asyncio.sleep(2)


async def create_roles():
    doctor_role = await Role.create(
        name="GP"
    )
    admin_role = await Role.create(
        name="admin"
    )
    for perm in Permissions:
        if (perm is not Permissions.USER_CREATE)\
                and (perm is not Permissions.USER_UPDATE)\
                and (perm is not Permissions.ROLE_CREATE)\
                and (perm is not Permissions.ROLE_UPDATE)\
                and (perm is not Permissions.PATHWAY_CREATE):
            await RolePermission.create(
                role_id=doctor_role.id,
                permission=perm,
            )
        else:
            await RolePermission.create(
                role_id=admin_role.id,
                permission=perm
            )
    return {
        "doctor": doctor_role,
        "admin": admin_role
    }


async def insert_demo_data():
    roles = await create_roles()

    general_milestone_types: Dict[str, MilestoneType] = {
        "referral_letter": await MilestoneType.create(
            name="Referral letter",
            ref_name="Referral letter (record artifact)",
            is_checkbox_hidden=True
        ),
        "pathology": await MilestoneType.create(
            name="Pathology",
            ref_name="Pathology report (record artifact)",
            is_checkbox_hidden=True
        ),
        "prehab_referral": await MilestoneType.create(
            name="Prehab referral",
            ref_name="Prehabilitation (regime/therapy)"
        ),
        "dietician_referral": await MilestoneType.create(
            name="Dietician referral",
            ref_name="Patient referral to dietitian (procedure)"
        ),
        "smoking_cessation_referral": await MilestoneType.create(
            name="Smoking cessation referral",
            ref_name="Referral to smoking cessation service (procedure)"
        ),
        "chest_xray": await MilestoneType.create(
            name="Chest X-ray",
            ref_name="Plain chest X-ray (procedure)",
            is_test_request=True
        ),
        "ct_chest": await MilestoneType.create(
            name="CT chest",
            ref_name="Computed tomography of chest (procedure)",
            is_test_request=True
        ),
        "ref_to_surgery": await MilestoneType.create(
            name="Refer to surgeons",
            ref_name="ref Surgeons",
            is_discharge=True
        ),
        "ref_to_oncology": await MilestoneType.create(
            name="Refer to oncology",
            ref_name="ref Oncology",
            is_discharge=True
        ),
        "ref_to_palliative": await MilestoneType.create(
            name="Refer to palliation",
            ref_name="ref Palliation",
            is_discharge=True
        ),
        "discharge": await MilestoneType.create(
            name="Discharge",
            ref_name="ref Discharge",
            is_discharge=True
        ),
        "mdt": await MilestoneType.create(
            name="Add to MDT",
            ref_name="Assessment by multidisciplinary team (procedure)"
        ),
        "clinic": await MilestoneType.create(
            name="Book clinic appointment",
            ref_name="Appointment (record artifact)"
        )
    }

    selectable_milestone_types: List[MilestoneType] = [
        await MilestoneType.create(
            name="PET-CT",
            ref_name="Positron emission tomography with computed tomography (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="CT head - contrast",
            ref_name="Computed tomography of head with contrast (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="MRI head",
            ref_name="Magnetic resonance imaging of head (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="Lung function tests",
            ref_name="Measurement of respiratory function (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="ECHO",
            ref_name="Echocardiography (procedure)", 
            is_test_request=True
        ),
        await MilestoneType.create(
            name="CT guided biopsy thorax",
            ref_name="Biopsy of thorax using computed tomography guidance (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="EBUS",
            ref_name="Transbronchial needle aspiration using endobronchial ultrasonography guidance (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="ECG",
            ref_name="Electrocardiogram analysis (qualifier value)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="Thoracoscopy",
            ref_name="Thoracoscopy (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="Bronchoscopy",
            ref_name="Bronchoscopy (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="Pleural tap",
            ref_name="Thoracentesis (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="CPET",
            ref_name="Cardiopulmonary exercise test (procedure)",
            is_test_request=True
        ),
        await MilestoneType.create(
            name="Bloods",
            ref_name="Blood test (procedure)",
            is_test_request=True
        ),
    ]

    for pathwayIndex in range(1, NUMBER_OF_PATHWAYS+1):
        sd_pathway: Pathway = await Pathway.create(
            name=f"Lung cancer demo {pathwayIndex}"
        )
        print(f"pathway id {sd_pathway.id} name {sd_pathway.name}")

        for key, milestoneType in general_milestone_types.items():
            await PathwayMilestoneType.create(
                pathway_id=sd_pathway.id,
                milestone_type_id=milestoneType.id
            )
        for milestoneType in selectable_milestone_types:
            await PathwayMilestoneType.create(
                pathway_id=sd_pathway.id,
                milestone_type_id=milestoneType.id
            )

        for userIndex in range(1, NUMBER_OF_USERS_PER_PATHWAY+1):
            unencoded_password = f"22password{pathwayIndex}"
            sd_password = hashpw(
                unencoded_password.encode('utf-8'),
                gensalt()
            ).decode('utf-8')
            sd_user: User = await User.create(
                username=f"demo-{pathwayIndex}-{userIndex}",
                password=sd_password,
                first_name="Demo",
                last_name=f"User {pathwayIndex} {userIndex}",
                department="Demo user",
                default_pathway_id=sd_pathway.id
            )
            await UserRole.create(
                user_id=sd_user.id,
                role_id=roles['doctor'].id
            )
            if userIndex % 2 == 0:
                await UserRole.create(
                    user_id=sd_user.id,
                    role_id=roles['admin'].id
                )
            print(f"Creating user (username: {sd_user.username}; password {unencoded_password}")

        for i in range(1, NUMBER_OF_PATIENTS_PER_PATHWAY+1):

            # hospital_number = "fMRN"+str(randint(10000, 99999)) + str(i)
            # national_number = "fNHS"+str(randint(1000000, 9999999)) + str(i)

            hospital_number_prefix = "fMRN"
            hospital_number = f"{sd_pathway.id}{i}"
            while len(hospital_number) != 6:
                hospital_number = str(randint(1, 9)) + hospital_number
            hospital_number = hospital_number_prefix + hospital_number

            national_number_prefix = "fNHS"
            national_number = f"{sd_pathway.id}{i}"
            while len(national_number) != 9:
                national_number = str(randint(1, 9)) + national_number
            national_number = national_number_prefix + national_number

            date_of_birth = date(randint(1950, 1975), randint(1, 12), randint(1, 27))

            sd_patient: Patient = await Patient.create(
                hospital_number=hospital_number,
                national_number=national_number
            )

            await PseudoTrustAdapter().create_patient(
                patient=Patient_IE(
                    first_name=faker.first_name(),
                    last_name=faker.last_name(),
                    hospital_number=hospital_number,
                    national_number=national_number,
                    date_of_birth=date_of_birth,
                    communication_method="LETTER"
                ),
                auth_token=SESSION_COOKIE
            )

            sd_onpathway: OnPathway = await OnPathway.create(
                patient_id=sd_patient.id,
                pathway_id=sd_pathway.id,
            )

            tie_testresult_ref: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                testResult=TestResultRequest_IE(
                    type_id=general_milestone_types["referral_letter"].id,
                    current_state=MilestoneState.COMPLETED,
                    hospital_number=hospital_number
                ),
                auth_token=SESSION_COOKIE
            )
            sd_milestone_ref: Milestone = await Milestone.create(
                on_pathway_id=sd_onpathway.id,
                test_result_reference_id=str(tie_testresult_ref.id),
                current_state=MilestoneState.COMPLETED,
                milestone_type_id=general_milestone_types["referral_letter"].id
            )

            tie_testresult_cxr: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                testResult=TestResultRequest_IE(
                    type_id=general_milestone_types["chest_xray"].id,
                    current_state=MilestoneState.COMPLETED,
                    hospital_number=hospital_number
                ),
                auth_token=SESSION_COOKIE
            )
            sd_milestone_cxr: Milestone = await Milestone.create(
                on_pathway_id=sd_onpathway.id,
                test_result_reference_id=str(tie_testresult_cxr.id),
                current_state=MilestoneState.COMPLETED,
                milestone_type_id=general_milestone_types["chest_xray"].id
            )

            tie_testresult_ctx: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                testResult=TestResultRequest_IE(
                    type_id=general_milestone_types["ct_chest"].id,
                    current_state=MilestoneState.COMPLETED,
                    hospital_number=hospital_number
                ),
                auth_token=SESSION_COOKIE
            )
            sd_milestone_ctx: Milestone = await Milestone.create(
                on_pathway_id=sd_onpathway.id,
                test_result_reference_id=str(tie_testresult_ctx.id),
                current_state=MilestoneState.COMPLETED,
                milestone_type_id=general_milestone_types["ct_chest"].id
            )

            if isinstance(sd_patient, DataCreatorInputErrors):
                raise Exception(sd_patient.errorList)

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(check_connection())
loop.run_until_complete(clear_existing_data())
loop.run_until_complete(insert_demo_data())
