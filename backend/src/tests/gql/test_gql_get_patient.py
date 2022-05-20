import json
import pytest
from datetime import datetime
from random import randint
from models import Patient, OnPathway, DecisionPoint, Milestone
from trustadapter.trustadapter import Patient_IE, TestResult_IE
from SdTypes import DecisionTypes, MilestoneState
from hamcrest import assert_that, equal_to, not_none, contains_string


@pytest.fixture
def get_patient_query() -> str:
    return """
        query getPatient($hospitalNumber:String!){
            getPatient(hospitalNumber:$hospitalNumber){
                id
                firstName
                lastName
                hospitalNumber
                nationalNumber
                dateOfBirth
                communicationMethod
                onPathways{
                    id
                    patient{
                        id
                        firstName
                        lastName
                        hospitalNumber
                        nationalNumber
                        dateOfBirth
                        communicationMethod
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
                    underCareOf {
                        id
                        username
                        firstName
                        lastName
                    }
                    milestones{
                        id
                        milestoneType{
                            id
                            name
                        }
                        onPathway{
                            id
                        }
                        testResult{
                            id
                            description
                            currentState
                            addedAt
                            updatedAt
                            typeReferenceName
                        }
                        addedAt
                        updatedAt
                        currentState
                    }
                    decisionPoints {
                        id
                        clinician{
                            id
                            username
                        }
                        onPathway{
                            id
                            pathway{
                                id
                                name
                            }
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
                        milestoneResolutions{
                            id
                        }
                        decisionType
                        clinicHistory
                        comorbidities
                        addedAt
                        updatedAt
                    }
                }
            }
        }
    """


# Scenario: a patient's record is searched for
@pytest.mark.asyncio
async def test_search_for_patient(
    patient_read_permission,
    get_patient_query,
    test_pathway,
    test_user, test_milestone_type,
    mock_trust_adapter,
    httpx_test_client, httpx_login_user,
):
    """
    When: we run the GraphQL mutation to search for a patient
    """

    PATIENT = await Patient.create(
        hospital_number=f"fMRN{randint(100000,999999)}",
        national_number=f"fNHS{randint(100000000,999999999)}",
    )

    PATIENT_IE = Patient_IE(
        first_name="Test",
        last_name="User",
        hospital_number=PATIENT.hospital_number,
        national_number=PATIENT.national_number,
        date_of_birth=datetime(year=2000, month=1, day=1).date(),
        communication_method="LETTER"
    )

    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id,
        is_discharged=False,
        under_care_of_id=test_user.user.id
    )

    DECISION_POINT = await DecisionPoint.create(
        clinician_id=test_user.user.id,
        on_pathway_id=ONPATHWAY.id,
        decision_type=DecisionTypes.TRIAGE,
        clinic_history="Test go brrrrt",
        comorbidities="I ran out of things to put here"
    )

    MILESTONE_ONE = await Milestone.create(
        on_pathway_id=ONPATHWAY.id,
        test_result_reference_id="1000",
        current_state=MilestoneState.COMPLETED.value,
        milestone_type_id=test_pathway.id,
        fwd_decision_point_id=DECISION_POINT.id
    )

    await Milestone.create(
        on_pathway_id=ONPATHWAY.id,
        decision_point_id=DECISION_POINT.id,
        test_result_reference_id="2000",
        current_state=MilestoneState.COMPLETED.value,
        milestone_type_id=test_pathway.id
    )

    FIRST_TEST_RESULT = TestResult_IE(
        id=1000,
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=test_milestone_type.ref_name,
    )
    SECOND_TEST_RESULT = TestResult_IE(
        id=2000,
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=test_milestone_type.ref_name,
    )

    async def create_test_result(**kwargs):
        return SECOND_TEST_RESULT

    async def load_test_result(recordId, **kwargs):
        if recordId == 1000:
            return FIRST_TEST_RESULT
        elif recordId == 2000:
            return SECOND_TEST_RESULT

    async def load_many_test_results(recordIds, **kwargs):
        retVal = []
        if 1000 in recordIds:
            retVal.append(FIRST_TEST_RESULT)
        if 2000 in recordIds:
            retVal.append(SECOND_TEST_RESULT)
        return retVal

    mock_trust_adapter.create_test_result = create_test_result
    mock_trust_adapter.load_test_result = load_test_result
    mock_trust_adapter.load_many_test_results = load_many_test_results

    async def load_patient(**kwargs):
        return PATIENT_IE
    mock_trust_adapter.load_patient = load_patient

    async def load_many_patients(**kwargs):
        return [PATIENT_IE]
    mock_trust_adapter.load_many_patients = load_many_patients

    get_patient_result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": get_patient_query,
            "variables": {
                "hospitalNumber": PATIENT.hospital_number,
            }
        }
    )

    assert_that(get_patient_result.status_code, equal_to(200))
    print(get_patient_result.text)
    assert_that(
        json.loads(get_patient_result.text)['data']['getPatient'],
        not_none()
    )

    patient_record = json.loads(get_patient_result.text)['data']['getPatient']
    print(patient_record['onPathways'][0]['decisionPoints'])

    assert_that(patient_record['id'], not_none())
    assert_that(
        patient_record['firstName'], equal_to(PATIENT_IE.first_name)
    )
    assert_that(
        patient_record['lastName'], equal_to(PATIENT_IE.last_name)
    )
    assert_that(
        patient_record['hospitalNumber'], equal_to(PATIENT_IE.hospital_number)
    )
    assert_that(
        patient_record['nationalNumber'], equal_to(PATIENT_IE.national_number)
    )
    assert_that(
        patient_record['dateOfBirth'],
        equal_to(PATIENT_IE.date_of_birth.isoformat())
    )

    on_pathway = patient_record['onPathways'][0]

    assert_that(on_pathway['pathway'], not_none())
    assert_that(on_pathway['pathway']['id'], test_pathway.id)
    assert_that(on_pathway['pathway']['name'], test_pathway.name)
    assert_that(on_pathway['id'], not_none())
    assert_that(on_pathway['patient'], not_none())
    assert_that(on_pathway['patient']['id'], equal_to(str(PATIENT.id)))
    assert_that(on_pathway['isDischarged'], equal_to(False))
    assert_that(
        on_pathway['awaitingDecisionType'],
        equal_to(DecisionTypes.TRIAGE.value)
    )
    assert_that(on_pathway['addedAt'], not_none())
    assert_that(on_pathway['updatedAt'], not_none())
    assert_that(on_pathway['referredAt'], not_none())
    assert_that(on_pathway['underCareOf'], not_none())
    assert_that(
        on_pathway['underCareOf']['id'],
        equal_to(str(test_user.user.id))
    )
    assert_that(
        on_pathway['underCareOf']['username'],
        equal_to(test_user.user.username)
    )
    assert_that(
        on_pathway['underCareOf']['firstName'],
        equal_to(test_user.user.first_name)
    )
    assert_that(
        on_pathway['underCareOf']['lastName'],
        equal_to(test_user.user.last_name)
    )
    milestones = on_pathway['milestones'][0]
    assert_that(milestones, not_none())
    assert_that(milestones['id'], equal_to(str(MILESTONE_ONE.id)))
    assert_that(milestones['milestoneType'], not_none())
    assert_that(
        milestones['milestoneType']['id'],
        equal_to(str(test_milestone_type.id))
    )
    assert_that(
        milestones['milestoneType']['name'],
        equal_to(test_milestone_type.name)
    )
    assert_that(milestones['onPathway'], not_none())
    assert_that(milestones['onPathway']['id'], equal_to(str(ONPATHWAY.id)))
    assert_that(
        milestones['addedAt'],
        equal_to(MILESTONE_ONE.added_at.isoformat())
    )
    assert_that(
        milestones['updatedAt'],
        equal_to(MILESTONE_ONE.updated_at.isoformat())
    )
    assert_that(
        milestones['currentState'],
        equal_to(MILESTONE_ONE.current_state.value)
    )
    assert_that(milestones['testResult'], not_none())
    assert_that(
        milestones['testResult']['id'],
        equal_to(str(FIRST_TEST_RESULT.id))
    )
    assert_that(
        milestones['testResult']['description'],
        equal_to(FIRST_TEST_RESULT.description)
    )
    assert_that(
        milestones['testResult']['currentState'],
        equal_to(FIRST_TEST_RESULT.current_state.value)
    )
    assert_that(
        milestones['testResult']['addedAt'],
        equal_to(FIRST_TEST_RESULT.added_at.isoformat())
    )
    assert_that(
        milestones['testResult']['updatedAt'],
        equal_to(FIRST_TEST_RESULT.updated_at.isoformat())
    )
    assert_that(
        milestones['testResult']['typeReferenceName'],
        equal_to(FIRST_TEST_RESULT.type_reference_name)
    )
    dp_milestone = on_pathway['decisionPoints'][0]['milestones'][0]

    assert_that(dp_milestone, not_none())
    assert_that(dp_milestone['id'], not_none())
    assert_that(dp_milestone['milestoneType'], not_none())
    assert_that(
        dp_milestone['milestoneType']['id'],
        equal_to(str(test_milestone_type.id))
    )
    assert_that(
        dp_milestone['milestoneType']['name'],
        equal_to(test_milestone_type.name)
    )
    assert_that(dp_milestone['testResult'], not_none())
    assert_that(
        dp_milestone['testResult']['id'],
        equal_to(str(SECOND_TEST_RESULT.id))
    )
    assert_that(
        dp_milestone['testResult']['description'],
        equal_to(SECOND_TEST_RESULT.description)
    )
    assert_that(
        dp_milestone['testResult']['currentState'],
        equal_to(str(SECOND_TEST_RESULT.current_state.value))
    )
    assert_that(
        dp_milestone['testResult']['addedAt'],
        equal_to(SECOND_TEST_RESULT.added_at.isoformat())
    )
    assert_that(
        dp_milestone['testResult']['updatedAt'],
        equal_to(SECOND_TEST_RESULT.updated_at.isoformat())
    )
    assert_that(
        dp_milestone['testResult']['typeReferenceName'],
        equal_to(SECOND_TEST_RESULT.type_reference_name)
    )
    assert_that(
        on_pathway['decisionPoints'][0]['milestoneResolutions'],
        not_none()
    )
    assert_that(
        on_pathway['decisionPoints'][0]['milestoneResolutions'][0]['id'],
        equal_to(str(MILESTONE_ONE.id))
    )


async def test_user_lacks_permission(
    login_user, test_client, get_patient_query
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": get_patient_query,
            "variables": {
                "hospitalNumber": "test",
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
