import datetime
from common import MutationUserErrorHandler
from models import (
    Pathway,
    Patient,
    ClinicalRequest,
    ClinicalRequestType,
    User,
    OnPathway,
    Role,
    RolePermission, UserRole,
    PathwayClinicalRequestType,
    UserPathway,
)
from containers import SDContainer
from api import app
from faker import Faker
from random import randint
from datetime import date
from SdTypes import ClinicalRequestState, Permissions, Sex
from trustadapter.trustadapter import (
    Patient_IE,
    TestResult_IE,
    TestResultRequestImmediately_IE,
    PseudoTrustAdapter
)
from typing import Dict, List
from bcrypt import hashpw, gensalt

faker = Faker(['en_GB'])
app.container = SDContainer()

NUMBER_OF_USERS_PER_PATHWAY = 10
NUMBER_OF_PATHWAYS = 20
NUMBER_OF_PATIENTS_PER_PATHWAY = 50


async def insert_bulk_data(SESSION_COOKIE: str = None):
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
                and (perm is not Permissions.ROLE_DELETE)\
                and (perm is not Permissions.PATHWAY_CREATE)\
                and (perm is not Permissions.PATHWAY_UPDATE)\
                and (perm is not Permissions.PATHWAY_DELETE):
            await RolePermission.create(
                role_id=doctor_role.id,
                permission=perm,
            )
        else:
            await RolePermission.create(
                role_id=admin_role.id,
                permission=perm
            )
    roles = {
        "doctor": doctor_role,
        "admin": admin_role
    }

    general_clinical_request_types: Dict[str, ClinicalRequestType] = {
        "referral_letter": await ClinicalRequestType.create(
            name="Referral letter",
            ref_name="Referral letter (record artifact)",
            is_checkbox_hidden=True
        ),
        "chest_xray": await ClinicalRequestType.create(
            name="Chest X-ray",
            ref_name="Plain chest X-ray (procedure)",
            is_test_request=True
        ),
        "ct_chest": await ClinicalRequestType.create(
            name="CT chest",
            ref_name="Computed tomography of chest (procedure)",
            is_test_request=True
        ),
        "mdt": await ClinicalRequestType.create(
            name="Add to MDT",
            ref_name="Multidisciplinary meeting (procedure)",
            is_mdt=True
        )
    }

    lung_cancer_clinical_request_types: List[ClinicalRequestType] = [
        await ClinicalRequestType.create(
            name="Pathology",
            ref_name="Pathology report (record artifact)",
            is_checkbox_hidden=True
        ),
        await ClinicalRequestType.create(
            name="Prehab referral",
            ref_name="Prehabilitation (regime/therapy)"
        ),
        await ClinicalRequestType.create(
            name="Dietician referral",
            ref_name="Patient referral to dietitian (procedure)"
        ),
        await ClinicalRequestType.create(
            name="Smoking cessation referral",
            ref_name="Referral to smoking cessation service (procedure)"
        ),
        await ClinicalRequestType.create(
            name="Refer to surgeons",
            ref_name="ref Surgeons",
            is_discharge=True
        ),
        await ClinicalRequestType.create(
            name="Refer to oncology",
            ref_name="ref Oncology",
            is_discharge=True
        ),
        await ClinicalRequestType.create(
            name="Refer to palliation",
            ref_name="ref Palliation",
            is_discharge=True
        ),
        await ClinicalRequestType.create(
            name="Discharge",
            ref_name="ref Discharge",
            is_discharge=True
        ),
        await ClinicalRequestType.create(
            name="Book clinic appointment",
            ref_name="Appointment (record artifact)"
        ),
        await ClinicalRequestType.create(
            name="PET-CT",
            ref_name=(
                "Positron emission tomography with computed "
                "tomography (procedure)"
            ),
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="CT head - contrast",
            ref_name="Computed tomography of head with contrast (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="MRI head",
            ref_name="Magnetic resonance imaging of head (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="Lung function tests",
            ref_name="Measurement of respiratory function (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="ECHO",
            ref_name="Echocardiography (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="CT guided biopsy thorax",
            ref_name=(
                "Biopsy of thorax using computed tomography guidance "
                "(procedure)"
            ),
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="EBUS",
            ref_name=(
                "Transbronchial needle aspiration using endobronchial "
                "ultrasonography guidance (procedure)"
            ),
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="ECG",
            ref_name="Electrocardiogram analysis (qualifier value)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="Thoracoscopy",
            ref_name="Thoracoscopy (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="Bronchoscopy",
            ref_name="Bronchoscopy (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="Pleural tap",
            ref_name="Thoracentesis (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="CPET",
            ref_name="Cardiopulmonary exercise test (procedure)",
            is_test_request=True
        ),
        await ClinicalRequestType.create(
            name="Bloods",
            ref_name="Blood test (procedure)",
            is_test_request=True
        ),
    ]

    for pathwayIndex in range(1, NUMBER_OF_PATHWAYS+1):
        pathways: List[Pathway] = [
            await Pathway.create(
                name=f"Lung cancer demo {pathwayIndex}-1"
            ),
            await Pathway.create(
                name=f"Lung cancer demo {pathwayIndex}-2"
            )
        ]

        for key in general_clinical_request_types:
            await PathwayClinicalRequestType.create(
                pathway_id=pathways[0].id,
                clinical_request_type_id=general_clinical_request_types[key].id
            )
            await PathwayClinicalRequestType.create(
                pathway_id=pathways[1].id,
                clinical_request_type_id=general_clinical_request_types[key].id
            )

        for mT in lung_cancer_clinical_request_types:
            await PathwayClinicalRequestType.create(
                pathway_id=pathways[0].id,
                clinical_request_type_id=mT.id
            )
            await PathwayClinicalRequestType.create(
                pathway_id=pathways[1].id,
                clinical_request_type_id=mT.id
            )

        for userIndex in range(1, NUMBER_OF_USERS_PER_PATHWAY+1):
            unencoded_password = f"22password{pathwayIndex}"
            sd_password = hashpw(
                unencoded_password.encode('utf-8'),
                gensalt()
            ).decode('utf-8')
            username = f"demo-{pathwayIndex}-{userIndex}"

            sd_user: User = await User.create(
                username=username,
                password=sd_password,
                email=f"{username}@sd-test.testdomain",
                first_name="Demo",
                last_name=f"User {pathwayIndex} {userIndex}",
                department="Demo user",
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

            await UserPathway.create(
                user_id=sd_user.id,
                pathway_id=pathways[0].id
            )
            await UserPathway.create(
                user_id=sd_user.id,
                pathway_id=pathways[1].id
            )

            print(
                f"Creating user (username: {sd_user.username}; "
                f"password {unencoded_password}"
            )

        for i in range(1, NUMBER_OF_PATIENTS_PER_PATHWAY+1):

            for pathway in pathways:
                hospital_number_prefix = "fMRN"
                hospital_number = f"{pathway.id}{i}"
                while len(hospital_number) != 6:
                    hospital_number = str(randint(1, 9)) + hospital_number
                hospital_number = hospital_number_prefix + hospital_number

                national_number_prefix = "fNHS"
                national_number = f"{pathway.id}{i}"
                while len(national_number) != 9:
                    national_number = str(randint(1, 9)) + national_number
                national_number = national_number_prefix + national_number

                date_of_birth = date(
                    randint(1950, 1975),
                    randint(1, 12),
                    randint(1, 27)
                )

                sd_patient: Patient = await Patient.create(
                    hospital_number=hospital_number,
                    national_number=national_number
                )

                if isinstance(sd_patient, MutationUserErrorHandler):
                    raise Exception(sd_patient.errorList)

                sex = Sex.MALE if randint(0, 1) == 0 else Sex.FEMALE
                if sex == Sex.MALE:
                    first_name = faker.first_name_male()
                else:
                    first_name = faker.first_name_female()

                await PseudoTrustAdapter().create_patient(
                    patient=Patient_IE(
                        first_name=first_name,
                        last_name=faker.last_name(),
                        hospital_number=hospital_number,
                        national_number=national_number,
                        date_of_birth=date_of_birth,
                        communication_method="LETTER",
                        sex=sex,
                        occupation=faker.job(),
                        telephone_number=faker.phone_number(),
                        address={
                            "line": f"{randint(1,1000)} {faker.street_name()}",
                            "city": faker.city(),
                            "district": faker.county(),
                            "postal_code": faker.postcode(),
                            "country": "England",
                        }
                    ),
                    auth_token=SESSION_COOKIE
                )

                sd_onpathway: OnPathway = await OnPathway.create(
                    patient_id=sd_patient.id,
                    pathway_id=pathway.id,
                )

                tie_testresult_ref: TestResult_IE = await PseudoTrustAdapter()\
                    .create_test_result_immediately(
                        testResult=TestResultRequestImmediately_IE(
                            type_id=general_clinical_request_types
                            ["referral_letter"].id,
                            current_state=ClinicalRequestState.COMPLETED,
                            hospital_number=hospital_number,
                            pathway_name=pathway.name
                        ),
                        auth_token=SESSION_COOKIE
                    )

                await ClinicalRequest.create(
                    on_pathway_id=sd_onpathway.id,
                    test_result_reference_id=str(tie_testresult_ref.id),
                    current_state=ClinicalRequestState.COMPLETED,
                    completed_at=datetime.datetime.now(),
                    clinical_request_type_id=general_clinical_request_types
                    ["referral_letter"].id,
                )

                tie_testresult_cxr: TestResult_IE = await PseudoTrustAdapter()\
                    .create_test_result_immediately(
                        testResult=TestResultRequestImmediately_IE(
                            type_id=general_clinical_request_types
                            ["chest_xray"].id,
                            current_state=ClinicalRequestState.COMPLETED,
                            hospital_number=hospital_number,
                            pathway_name=pathway.name
                        ),
                        auth_token=SESSION_COOKIE
                    )
                await ClinicalRequest.create(
                    on_pathway_id=sd_onpathway.id,
                    test_result_reference_id=str(tie_testresult_cxr.id),
                    current_state=ClinicalRequestState.COMPLETED,
                    completed_at=datetime.datetime.now(),
                    clinical_request_type_id=general_clinical_request_types
                    ["chest_xray"].id,
                )

                tie_testresult_ctx: TestResult_IE = await PseudoTrustAdapter()\
                    .create_test_result_immediately(
                        testResult=TestResultRequestImmediately_IE(
                            type_id=general_clinical_request_types
                            ["ct_chest"].id,
                            current_state=ClinicalRequestState.COMPLETED,
                            hospital_number=hospital_number,
                            pathway_name=pathway.name
                        ),
                        auth_token=SESSION_COOKIE
                    )
                await ClinicalRequest.create(
                    on_pathway_id=sd_onpathway.id,
                    test_result_reference_id=str(tie_testresult_ctx.id),
                    current_state=ClinicalRequestState.COMPLETED,
                    completed_at=datetime.datetime.now(),
                    clinical_request_type_id=general_clinical_request_types
                    ["ct_chest"].id,
                )
