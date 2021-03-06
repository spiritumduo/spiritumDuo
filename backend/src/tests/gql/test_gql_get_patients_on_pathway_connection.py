import json
import pytest
from datetime import date
from models import Patient, OnPathway
from trustadapter.trustadapter import Patient_IE
from hamcrest import (
    assert_that, equal_to,
    not_, not_none, has_key,
    contains_string
)


# Feature: testing getPatientsOnPathwayConnection
# Scenario: the getPatientsOnPathwayConnection function is called
@pytest.mark.asyncio
async def test_get_patient_on_pathway_connection(
    patient_read_permission,
    on_pathway_read_permission,
    test_pathway, test_user, mock_trust_adapter,
    httpx_test_client, httpx_login_user,
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

    get_patient_on_pathway_result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getPatientOnPathwayConnection(
                    $pathwayId: ID!,
                    $first: Int!
                ){
                    getPatientOnPathwayConnection(
                        pathwayId: $pathwayId,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id,
                "first": 2
            }
        }
    )

    assert_that(
        get_patient_on_pathway_result.status_code,
        equal_to(200)
    )  # check the HTTP status for 200 OK
    assert_that(
        json.loads(
            get_patient_on_pathway_result.text
        )['data']['getPatientOnPathwayConnection'],
        not_none()
    )
    patient_list = json.loads(
        get_patient_on_pathway_result.text
    )['data']['getPatientOnPathwayConnection']

    """
    Then: we get all the patients on that pathway
    """
    assert_that(
        patient_list['edges'][0]['node']['id'],
        equal_to(str(PATIENT_ONE.id))
    )
    assert_that(
        patient_list['edges'][1]['node']['id'],
        equal_to(str(PATIENT_TWO.id))
    )
    assert_that(
        patient_list['edges'],
        not_(has_key(2))
    )

    """
    Then: we get all the patients on that pathway using a cursor
    """

    get_patient_on_pathway_result_cursor = await httpx_test_client.post(
        url="graphql",
        json={
            "query": """
                query getPatientOnPathwayConnection(
                    $pathwayId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getPatientOnPathwayConnection(
                        pathwayId: $pathwayId,
                        after: $after,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
            """,
            "variables": {
                "pathwayId": test_pathway.id,
                "after": patient_list['edges'][1]['cursor'],
                "first": 2
            }
        }
    )

    assert_that(
        get_patient_on_pathway_result_cursor.status_code,
        equal_to(200)
    )  # check the HTTP status for 200 OK
    assert_that(
        json.loads(
            get_patient_on_pathway_result_cursor.text
        )['data']['getPatientOnPathwayConnection'],
        not_none()
    )
    patient_list_cursor = json.loads(
        get_patient_on_pathway_result_cursor.text
    )['data']['getPatientOnPathwayConnection']

    """
    Then: we get all the patients on that pathway
    """
    assert_that(
        patient_list_cursor['edges'][0]['node']['id'],
        equal_to(str(PATIENT_THREE.id))
    )
    assert_that(
        patient_list_cursor['edges'],
        not_(has_key(1))
    )


async def test_user_lacks_permission(
    login_user, test_client
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": """
                query getPatientOnPathwayConnection(
                    $pathwayId: ID!,
                    $first: Int!
                    $after: String!
                ){
                    getPatientOnPathwayConnection(
                        pathwayId: $pathwayId,
                        after: $after,
                        first: $first
                    ){
                        totalCount
                        edges{
                            cursor
                            node{
                                id
                            }
                        }
                    }
                }
                """,
            "variables": {
                "pathwayId": "test",
                "first": 12,
                "after": "something"
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
