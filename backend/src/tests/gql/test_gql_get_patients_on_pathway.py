import json
import pytest
from datetime import date
from models import Patient, OnPathway
from trustadapter.trustadapter import Patient_IE
from hamcrest import (
    assert_that, equal_to,
    not_none, contains_string
)


@pytest.fixture
def get_patient_on_pathway_query() -> str:
    return """
        query getPatientsOnPathway(
            $pathwayId: ID!,
        ){
            getPatientsOnPathway(
                pathwayId: $pathwayId
            ){
                id
            }
        }
    """


# Feature: testing getPatientsOnPathway
# Scenario: the getPatientsOnPathway function is called
async def test_get_patients_on_pathway(
        patient_read_permission,
        on_pathway_read_permission,
        get_patient_on_pathway_query,
        mock_trust_adapter,
        test_pathway, test_user,
        httpx_test_client,
        httpx_login_user
):
    mock_trust_adapter.test_connection.return_value = True
    """
    Given: we have patients on a pathway
    """
    PATIENT_ONE = await Patient.create(
        hospital_number="fMRN111111",
        national_number="fNHS111111111"
    )
    PATIENT_ONE_IE = Patient_IE(
        first_name="Test",
        last_name="One",
        hospital_number=PATIENT_ONE.hospital_number,
        national_number=PATIENT_ONE.national_number,
        date_of_birth=date.fromisoformat("2000-01-01"),
    )
    PATIENT_TWO = await Patient.create(
        hospital_number="fMRN222222",
        national_number="fNHS22222222"
    )
    PATIENT_TWO_IE = Patient_IE(
        first_name="Test",
        last_name="Two",
        hospital_number=PATIENT_TWO.hospital_number,
        national_number=PATIENT_TWO.national_number,
        date_of_birth=date.fromisoformat("2000-01-01"),
    )
    PATIENT_THREE = await Patient.create(
        hospital_number="fMRN333333",
        national_number="fNHS33333333"
    )
    PATIENT_THREE_IE = Patient_IE(
        first_name="Test",
        last_name="Three",
        hospital_number=PATIENT_THREE.hospital_number,
        national_number=PATIENT_THREE.national_number,
        date_of_birth=date.fromisoformat("2000-01-01"),
    )

    await OnPathway.create(
        patient_id=PATIENT_ONE.id,
        pathway_id=test_pathway.id,
        under_care_of_id=test_user.user.id
    )
    await OnPathway.create(
        patient_id=PATIENT_TWO.id,
        pathway_id=test_pathway.id,
        under_care_of_id=test_user.user.id
    )
    await OnPathway.create(
        patient_id=PATIENT_THREE.id,
        pathway_id=test_pathway.id,
        under_care_of_id=test_user.user.id
    )

    async def load_patient(recordId, **kwargs):
        if int(recordId) == PATIENT_ONE.id:
            return PATIENT_ONE_IE
        elif int(recordId) == PATIENT_TWO.id:
            return PATIENT_TWO_IE
        elif int(recordId) == PATIENT_THREE.id:
            return PATIENT_THREE_IE
        return None

    async def load_many_patients(recordIds, **kwargs):
        retVal = []
        if str(PATIENT_ONE.id) in recordIds:
            retVal.append(PATIENT_ONE_IE)
        if str(PATIENT_TWO.id) in recordIds:
            retVal.append(PATIENT_TWO_IE)
        if str(PATIENT_THREE.id) in recordIds:
            retVal.append(PATIENT_THREE_IE)
        return retVal

    mock_trust_adapter.load_patient = load_patient
    mock_trust_adapter.load_many_patients = load_many_patients

    """
    When: we execute the query
    """

    get_patients_on_pathway_result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": get_patient_on_pathway_query,
            "variables": {
                "pathwayId": test_pathway.id
            }
        }
    )
    assert_that(
        get_patients_on_pathway_result.status_code,
        equal_to(200)
    )
    assert_that(
        json.loads(
            get_patients_on_pathway_result.text
        )['data']['getPatientsOnPathway'],
        not_none()
    )  # make sure there are no input errors
    patient_list = json.loads(
        get_patients_on_pathway_result.text
    )['data']['getPatientsOnPathway']

    """
    Then: we get all the patients on that pathway
    """
    assert_that(patient_list[0]['id'], equal_to(str(PATIENT_ONE.id)))
    assert_that(patient_list[1]['id'], equal_to(str(PATIENT_TWO.id)))
    assert_that(patient_list[2]['id'], equal_to(str(PATIENT_THREE.id)))


async def test_user_lacks_permission(
    login_user, test_client,
    get_patient_on_pathway_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": get_patient_on_pathway_query,
            "variables": {
                "pathwayId": "test"
            }
        }
    )
    """
    The request should fail
    """
    payload = res.json()
    assert_that(res.status_code, equal_to(200))
    assert_that(
        payload['errors'][0]['message'],
        contains_string("Missing one or many permissions")
    )