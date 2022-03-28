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
    OnPathway
)
from containers import SDContainer
from models.db import db, DATABASE_URL
from api import app
from faker import Faker
from random import randint, getrandbits
from datetime import date
from SdTypes import DecisionTypes, MilestoneState
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
from typing import Dict
from bcrypt import hashpw, gensalt

faker = Faker()
app.container = SDContainer()

NUMBER_OF_USERS = 100
NUMBER_OF_PATIENTS_PER_USER = 5


class RequestPlaceholder(dict):
    """
    This is a test
    """


CLINIC_HISTORY = [
    "Likely right upper lobe lung cancer.",
    "Proximal large lung cancer. Likely palliative.",
    """Left lower lobe mass, likely primary lung cancer. Stopped smoking
    5 years ago""",
    "Metastatic disease of likely lung origin.",
    "Left upper lobe collapse secondary to likely lung cancer",
]

COMORBIDITIES = [
    """Chronic obstructive pulmonary disease, osteoporosis and a previous
    cardioversion 2 years ago for atrial fibrillation.""",
    """Hartmann's procedure for lower bowel cancer. Hypertension and
    type 2 diabetes""",
    "Glaucoma, hysterectomy and fibromyalgia.",
    "Current smoker (50 pack years) and COPD.",
    """Previous T4-N0-M0 squamous carcinoma of the lung treated with CHART and
    chemotherapy 2008. Atrial flutter and on apixaban."""
]

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
    await Milestone.delete.where(Milestone.id >= 0).gino.status()
    await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
    await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
    await Session.delete.gino.status()
    await User.delete.where(User.username.like("%user%")).gino.status()
    await Pathway.delete.where(Pathway.id >= 0).gino.status()
    await Patient.delete.where(Patient.id >= 0).gino.status()
    await MilestoneType.delete.where(MilestoneType.id >= 0).gino.status()
    print("********************")
    print("\33[31mNOTE: you may need to clear the `PSEUDOTIE` database in")
    print("the event of HTTP 409 (conflict)\33[0m")
    print("********************")
    await asyncio.sleep(2)


async def insert_demo_data():
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

    selectable_milestone_types: Dict[str, MilestoneType] = {
        "pet_ct": await MilestoneType.create(
            name="PET-CT",
            ref_name="Positron emission tomography with computed tomography (procedure)",
            is_test_request=True
        ),
        "ct_head": await MilestoneType.create(
            name="CT head - contrast",
            ref_name="Computed tomography of head with contrast (procedure)",
            is_test_request=True
        ),
        "mri_head": await MilestoneType.create(
            name="MRI head",
            ref_name="Magnetic resonance imaging of head (procedure)",
            is_test_request=True
        ),
        "lung_func": await MilestoneType.create(
            name="Lung function tests",
            ref_name="Measurement of respiratory function (procedure)",
            is_test_request=True
        ),
        "echo": await MilestoneType.create(
            name="ECHO",
            ref_name="Echocardiography (procedure)",
            is_test_request=True
        ),
        "ct_biopsy_thorax": await MilestoneType.create(
            name="CT guided biopsy thorax",
            ref_name="Biopsy of thorax using computed tomography guidance (procedure)",
            is_test_request=True
        ),
        "ebus": await MilestoneType.create(
            name="EBUS",
            ref_name="Transbronchial needle aspiration using endobronchial ultrasonography guidance (procedure)",
            is_test_request=True
        ),
        "ecg": await MilestoneType.create(
            name="ECG",
            ref_name="Electrocardiogram analysis (qualifier value)",
            is_test_request=True
        ),
        "thoracoscopy": await MilestoneType.create(
            name="Thoracoscopy",
            ref_name="Thoracoscopy (procedure)",
            is_test_request=True
        ),
        "bronchoscopy": await MilestoneType.create(
            name="Bronchoscopy",
            ref_name="Bronchoscopy (procedure)",
            is_test_request=True
        ),
        "pleural_tap": await MilestoneType.create(
            name="Pleural tap",
            ref_name="Thoracentesis (procedure)",
            is_test_request=True
        ),
        "cpet": await MilestoneType.create(
            name="CPET",
            ref_name="Cardiopulmonary exercise test (procedure)",
            is_test_request=True
        ),
        "bloods": await MilestoneType.create(
            name="Bloods",
            ref_name="Blood test (procedure)",
            is_test_request=True
        ),
    }

    for i in range(1, NUMBER_OF_USERS+1):
        sd_pathway: Pathway = await Pathway.create(
            name=f"Lung cancer demo {i}"
        )
        print(f"pathway id {sd_pathway.id} name {sd_pathway.name}")

        sd_password = hashpw(
            f"22password{i}".encode('utf-8'),
            gensalt()
        ).decode('utf-8')
        sd_user: User = await User.create(
            id=int(i),
            username=f"user{i}",
            password=sd_password,
            first_name="Demo",
            last_name=f"User {i}",
            department="Demo user",
            default_pathway_id=sd_pathway.id
        )
        _CONTEXT['request']['user'] = sd_user

        print(f"Creating user {sd_user.username}")

        for i in range(1, NUMBER_OF_PATIENTS_PER_USER+1):

            hospital_number = "fMRN"+str(randint(10000, 99999)) + str(i)
            national_number = "fNHS"+str(randint(1000000, 9999999)) + str(i)

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
            await asyncio.sleep(0.1)

            if isinstance(sd_patient, DataCreatorInputErrors):
                raise Exception(sd_patient.errorList)

            """
            Everyone needs
                Referral
                CXR
                CTx
            """

            if i == 1:
                """
                Acknowledged:
                    Referral
                    Chest X-ray
                    CT chest
                Waiting confirmation:
                    PET-CT
                """
                sd_decisionpoint: DecisionPoint = await DecisionPoint.create(
                    clinician_id=sd_user.id,
                    on_pathway_id=sd_onpathway.id,
                    decision_type=DecisionTypes.TRIAGE.value,
                    clinic_history=CLINIC_HISTORY[i-1],
                    comorbidities=COMORBIDITIES[i-1]
                )
                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ref.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_cxr.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ctx.id).gino.status()

                tie_testresult_petct: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                    testResult=TestResultRequest_IE(
                        type_id=selectable_milestone_types["pet_ct"].id,
                        current_state=MilestoneState.COMPLETED,
                        hospital_number=hospital_number
                    ),
                    auth_token=SESSION_COOKIE
                )
                sd_testresult_petct: Milestone = await Milestone.create(
                    milestone_type_id=selectable_milestone_types["pet_ct"].id,
                    on_pathway_id=sd_onpathway.id,
                    decision_point_id=sd_decisionpoint.id,
                    test_result_reference_id=str(tie_testresult_petct.id),
                    current_state=MilestoneState.COMPLETED
                )

            elif i == 2:
                """
                Acknowledged:
                    Referral
                    Chest X-ray
                    CT chest
                Waiting confirmation:
                    None
                """

            elif i == 3:
                """
                Acknowledged:
                    Referral
                    Chest X-ray
                    CT chest
                    PET-CT
                Waiting confirmation:
                    CT-Bx
                """

                sd_decisionpoint: DecisionPoint = await DecisionPoint.create(
                    clinician_id=sd_user.id,
                    on_pathway_id=sd_onpathway.id,
                    decision_type=DecisionTypes.TRIAGE.value,
                    clinic_history=CLINIC_HISTORY[i-1],
                    comorbidities=COMORBIDITIES[i-1]
                )

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ref.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_cxr.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ctx.id).gino.status()

                tie_testresult_petct: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                    testResult=TestResultRequest_IE(
                        type_id=selectable_milestone_types["pet_ct"].id,
                        current_state=MilestoneState.COMPLETED,
                        hospital_number=hospital_number
                    ),
                    auth_token=SESSION_COOKIE
                )
                sd_testresult_petct: Milestone = await Milestone.create(
                    milestone_type_id=selectable_milestone_types["pet_ct"].id,
                    on_pathway_id=sd_onpathway.id,
                    decision_point_id=sd_decisionpoint.id,
                    test_result_reference_id=str(tie_testresult_petct.id),
                    current_state=MilestoneState.COMPLETED
                )

                sd_decisionpoint: DecisionPoint = await DecisionPoint.create(
                    clinician_id=sd_user.id,
                    on_pathway_id=sd_onpathway.id,
                    decision_type=DecisionTypes.TRIAGE.value,
                    clinic_history=CLINIC_HISTORY[i-1],
                    comorbidities=COMORBIDITIES[i-1]
                )

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_testresult_petct.id).gino.status()

                tie_testresult_ctbx: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                    testResult=TestResultRequest_IE(
                        type_id=selectable_milestone_types["ct_biopsy_thorax"].id,
                        current_state=MilestoneState.COMPLETED,
                        hospital_number=hospital_number
                    ),
                    auth_token=SESSION_COOKIE
                )
                sd_testresult_ctbx: Milestone = await Milestone.create(
                    milestone_type_id=selectable_milestone_types["ct_biopsy_thorax"].id,
                    on_pathway_id=sd_onpathway.id,
                    decision_point_id=sd_decisionpoint.id,
                    test_result_reference_id=str(tie_testresult_ctbx.id),
                    current_state=MilestoneState.COMPLETED
                )

            elif i == 4:
                """
                Acknowledged:
                    Referral
                    Chest X-ray
                    CT chest
                Waiting confirmation:
                    PET-CT
                """

                sd_decisionpoint: DecisionPoint = await DecisionPoint.create(
                    clinician_id=sd_user.id,
                    on_pathway_id=sd_onpathway.id,
                    decision_type=DecisionTypes.TRIAGE.value,
                    clinic_history=CLINIC_HISTORY[i-1],
                    comorbidities=COMORBIDITIES[i-1]
                )

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ref.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_cxr.id).gino.status()

                await Milestone.update.values(
                    fwd_decision_point_id=sd_decisionpoint.id
                ).where(Milestone.id == sd_milestone_ctx.id).gino.status()

                tie_testresult_petct: TestResult_IE = await PseudoTrustAdapter().create_test_result(
                    testResult=TestResultRequest_IE(
                        type_id=selectable_milestone_types["pet_ct"].id,
                        current_state=MilestoneState.COMPLETED,
                        hospital_number=hospital_number
                    ),
                    auth_token=SESSION_COOKIE
                )
                sd_testresult_petct: Milestone = await Milestone.create(
                    milestone_type_id=selectable_milestone_types["pet_ct"].id,
                    on_pathway_id=sd_onpathway.id,
                    decision_point_id=sd_decisionpoint.id,
                    test_result_reference_id=str(tie_testresult_petct.id),
                    current_state=MilestoneState.COMPLETED
                )

            elif i == 5:
                """
                Acknowledged:
                    None
                Waiting confirmation:
                    Referral
                    Chest X-ray
                    CT chest
                """

loop = asyncio.get_event_loop()
engine = loop.run_until_complete(db.set_bind(DATABASE_URL))
loop.run_until_complete(check_connection())
loop.run_until_complete(clear_existing_data())
loop.run_until_complete(insert_demo_data())
