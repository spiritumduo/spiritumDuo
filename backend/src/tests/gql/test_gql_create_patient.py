import json
import pytest
from datetime import datetime
from models import Patient
from trustadapter.trustadapter import Patient_IE, TestResult_IE
from SdTypes import DecisionTypes, MilestoneState
from hamcrest import assert_that, equal_to, not_none, none, contains_string


@pytest.fixture
def patient_create_query() -> str:
    return """
        mutation createPatient(
            $firstName: String!
            $lastName: String!
            $hospitalNumber: String!
            $nationalNumber: String!
            $dateOfBirth: Date!
            $pathwayId: ID!
            $milestoneTypeId: ID!
        ){
            createPatient(input: {
                firstName: $firstName,
                lastName: $lastName,
                hospitalNumber: $hospitalNumber,
                nationalNumber: $nationalNumber,
                dateOfBirth: $dateOfBirth,
                pathwayId: $pathwayId,
                milestones: [
                    {
                        milestoneTypeId: $milestoneTypeId,
                        currentState: COMPLETED
                    }
                ]
            }){
                patient{
                    id
                    firstName
                    lastName
                    hospitalNumber
                    nationalNumber
                    dateOfBirth
                    onPathways{
                        id
                        patient{
                            id
                        }
                        pathway{
                            id
                            name
                        }
                        isDischarged
                        awaitingDecisionType
                        addedAt
                        updatedAt
                        referredAt
                        decisionPoints{
                            id
                        }
                        underCareOf{
                            id
                        }
                        milestones{
                            id
                            milestoneType{
                                id
                                name
                            }
                            testResult{
                                id
                                description
                                currentState
                                addedAt
                                updatedAt
                                typeReferenceName
                            }
                        }
                    }
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


# Feature: GraphQL patient operations
# Scenario: a new patient needs to be added into the system
@pytest.mark.asyncio
async def test_add_new_patient_to_system(
    patient_create_permission,
    patient_create_query,
    mock_trust_adapter,
    httpx_test_client,
    httpx_login_user,
    test_milestone_type,
    test_pathway
):
    """
    When: we run the GraphQL mutation to add the patient onto the pathway
    """
    mock_trust_adapter.test_connection.return_value = True

    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456789",
    )

    PATIENT_IE = Patient_IE(
        first_name="Test",
        last_name="User",
        hospital_number=PATIENT.hospital_number,
        national_number=PATIENT.national_number,
        date_of_birth="2000-01-01",
        communication_method="LETTER"
    )

    async def load_patient(**kwargs):
        return Patient_IE(
            first_name="Test",
            last_name="User",
            hospital_number=PATIENT.hospital_number,
            national_number=PATIENT.national_number,
            date_of_birth=datetime(year=2000, month=1, day=1).date(),
            communication_method="LETTER"
        )
    mock_trust_adapter.load_patient = load_patient

    TEST_RESULT = TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=test_milestone_type.ref_name,
        id=1000
    )

    mock_trust_adapter.load_many_patients.return_value = [Patient_IE(
        first_name="Test",
        last_name="User",
        hospital_number=PATIENT.hospital_number,
        national_number=PATIENT.national_number,
        date_of_birth=datetime(year=2000, month=1, day=1).date(),
        communication_method=PATIENT_IE.communication_method
    )]

    mock_trust_adapter.create_patient.return_value = Patient_IE(
        first_name="Test",
        last_name="User",
        hospital_number=PATIENT.hospital_number,
        national_number=PATIENT.national_number,
        date_of_birth=datetime(year=2000, month=1, day=1).date(),
        communication_method=PATIENT_IE.communication_method
    )

    mock_trust_adapter.create_test_result_immediately.return_value = (
        TEST_RESULT)
    mock_trust_adapter.load_test_result.return_value = TEST_RESULT
    mock_trust_adapter.load_many_test_results.return_value = [
        TEST_RESULT
    ]

    create_patient_result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": patient_create_query,
            "variables": {
                "firstName": PATIENT_IE.first_name,
                "lastName": PATIENT_IE.last_name,
                "hospitalNumber": PATIENT_IE.hospital_number,
                "nationalNumber": PATIENT_IE.national_number,
                "dateOfBirth": PATIENT_IE.date_of_birth,
                "pathwayId": test_pathway.id,
                "milestoneTypeId": test_milestone_type.id
            }
        },
    )

    """
    Then: we get the patient's record
    """

    assert_that(create_patient_result.status_code, equal_to(200))
    assert_that(json.loads(
        create_patient_result.text
    )['data']['createPatient']['userErrors'], none())

    patient_record = json.loads(
        create_patient_result.text
    )['data']['createPatient']['patient']
    assert_that(
        patient_record['id'],
        not_none()
    )
    assert_that(
        patient_record['firstName'],
        equal_to(PATIENT_IE.first_name)
    )
    assert_that(
        patient_record['lastName'],
        equal_to(PATIENT_IE.last_name)
    )
    assert_that(
        patient_record['hospitalNumber'],
        equal_to(PATIENT_IE.hospital_number)
    )
    assert_that(
        patient_record['nationalNumber'],
        equal_to(PATIENT_IE.national_number)
    )
    assert_that(
        patient_record['dateOfBirth'],
        equal_to(PATIENT_IE.date_of_birth)
    )

    onPathway = patient_record['onPathways'][0]

    assert_that(onPathway['pathway'], not_none())
    assert_that(onPathway['pathway']['id'], test_pathway.id)
    assert_that(onPathway['pathway']['name'], test_pathway.name)
    assert_that(onPathway['id'], not_none())
    assert_that(onPathway['patient'], not_none())
    assert_that(onPathway['patient']['id'], equal_to(str(PATIENT.id)))
    assert_that(onPathway['isDischarged'], equal_to(False))
    assert_that(
        onPathway['awaitingDecisionType'],
        equal_to(DecisionTypes.TRIAGE.value)
    )
    assert_that(onPathway['addedAt'], not_none())
    assert_that(onPathway['updatedAt'], not_none())
    assert_that(onPathway['referredAt'], not_none())
    assert_that(onPathway['decisionPoints'], equal_to([]))
    assert_that(onPathway['underCareOf'], none())
    assert_that(onPathway['milestones'][0], not_none())
    assert_that(onPathway['milestones'][0]['id'], not_none())
    assert_that(onPathway['milestones'][0]['milestoneType'], not_none())
    assert_that(
        onPathway['milestones'][0]['milestoneType']['id'],
        test_milestone_type.id
    )
    assert_that(
        onPathway['milestones'][0]['milestoneType']['name'],
        test_milestone_type.name
    )
    assert_that(onPathway['milestones'][0]['testResult'], not_none())
    assert_that(
        onPathway['milestones'][0]['testResult']['id'],
        equal_to(str(TEST_RESULT.id))
    )
    assert_that(
        onPathway['milestones'][0]['testResult']['description'],
        equal_to(TEST_RESULT.description)
    )
    assert_that(
        onPathway['milestones'][0]['testResult']['currentState'],
        equal_to(str(TEST_RESULT.current_state.value))
    )
    assert_that(
        onPathway['milestones'][0]['testResult']['addedAt'],
        equal_to(TEST_RESULT.added_at.isoformat())
    )
    assert_that(
        onPathway['milestones'][0]['testResult']['updatedAt'],
        equal_to(TEST_RESULT.updated_at.isoformat())
    )
    assert_that(
        onPathway['milestones'][0]['testResult']['typeReferenceName'],
        equal_to(TEST_RESULT.type_reference_name)
    )


async def test_user_lacks_permission(
    login_user, test_client, patient_create_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": patient_create_query,
            "variables": {
                "firstName": "test",
                "lastName": "test",
                "hospitalNumber": "test",
                "nationalNumber": "test",
                "dateOfBirth": datetime.now().isoformat(),
                "pathwayId": "test",
                "milestoneTypeId": "test"
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
