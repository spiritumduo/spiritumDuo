import json
import pytest
from datetime import datetime
from random import randint
from models import Patient, OnPathway, DecisionPoint, Milestone
from trustadapter.trustadapter import Patient_IE, TestResult_IE
from SdTypes import DecisionTypes, MilestoneState
from hamcrest import assert_that, equal_to, not_none, none


# Scenario: a patient needs a decision point added and milestones requested
@pytest.mark.asyncio
async def test_add_decision_point_to_patient(context):
    """
    When: we run the GraphQL mutation to add the decision point and milestones
    """
    context.trust_adapter_mock.test_connection.return_value = True

    PATIENT = await Patient.create(
        hospital_number=f"fMRN{randint(100000,999999)}",
        national_number=f"fNHS{randint(100000000,999999999)}",
    )

    Patient_IE(
        id=PATIENT.id,
        first_name="Test",
        last_name="User",
        hospital_number=PATIENT.hospital_number,
        national_number=PATIENT.national_number,
        date_of_birth="2000-01-01",
        communication_method="LETTER"
    )

    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=context.PATHWAY.id,
        is_discharged=False,
        lock_user_id=context.USER.id,
        lock_end_time=datetime(2030, 1, 1, 3, 0, 0)
    )

    FIRST_MILESTONE = await Milestone.create(
        on_pathway_id=ONPATHWAY.id,
        test_result_reference_id="1000",
        milestone_type_id=context.MILESTONE_TYPE.id
    )

    DECISION_POINT = DecisionPoint(
        clinician_id=context.USER.id,
        on_pathway_id=ONPATHWAY.id,
        decision_type=DecisionTypes.TRIAGE,
        clinic_history="Test data blah blah blah",
        comorbidities="Test data go brrrrrrt"
    )

    FIRST_TEST_RESULT = TestResult_IE(
        id=1000,
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.MILESTONE_TYPE.ref_name,
    )
    SECOND_TEST_RESULT = TestResult_IE(
        id=2000,
        current_state=MilestoneState.INIT,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.MILESTONE_TYPE.ref_name,
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

    context.trust_adapter_mock.create_test_result = create_test_result
    context.trust_adapter_mock.load_test_result = load_test_result
    context.trust_adapter_mock.load_many_test_results = load_many_test_results

    async def load_patient(**kwargs):
        return Patient_IE(
            first_name="Test",
            last_name="User",
            hospital_number=PATIENT.hospital_number,
            national_number=PATIENT.national_number,
            date_of_birth=datetime(year=2000, month=1, day=1).date(),
            communication_method="LETTER"
        )
    context.trust_adapter_mock.load_patient = load_patient

    create_decision_point_result = await context.client.post(
        url="graphql",
        json={
            "query": """
                mutation createDecisionPoint(
                    $onPathwayId: ID!
                    $decisionType: DecisionType!
                    $clinicHistory: String!
                    $comorbidities: String!
                    $milestoneOneId: ID!
                    $milestoneResolutionId: ID!
                ){
                    createDecisionPoint(input: {
                        onPathwayId: $onPathwayId,
                        decisionType: $decisionType,
                        clinicHistory: $clinicHistory,
                        comorbidities: $comorbidities,
                        milestoneRequests:[
                            {
                                milestoneTypeId: $milestoneOneId
                            }
                        ]
                        milestoneResolutions:[
                            $milestoneResolutionId
                        ]
                    })
                    {
                        decisionPoint {
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
                        userErrors {
                            message
                            field
                        }
                    }
                }
            """,
            "variables": {
                "onPathwayId": ONPATHWAY.id,
                "decisionType": DECISION_POINT.decision_type.value,
                "clinicHistory": DECISION_POINT.clinic_history,
                "comorbidities": DECISION_POINT.comorbidities,
                "milestoneOneId": context.MILESTONE_TYPE.id,
                "milestoneResolutionId": FIRST_MILESTONE.id
            }
        }
    )

    assert_that(
        create_decision_point_result.status_code,
        equal_to(200)
    )  # check the HTTP status for 200 OK
    assert_that(json.loads(
        create_decision_point_result.text
    )['data']['createDecisionPoint']['userErrors'], none())
    decision_point = json.loads(
        create_decision_point_result.text
    )['data']['createDecisionPoint']['decisionPoint']

    assert_that(decision_point['id'], not_none())
    assert_that(decision_point['decisionType'], DECISION_POINT.decision_type)
    assert_that(decision_point['clinicHistory'], DECISION_POINT.clinic_history)
    assert_that(decision_point['comorbidities'], DECISION_POINT.comorbidities)
    assert_that(decision_point['addedAt'], DECISION_POINT.added_at)
    assert_that(decision_point['updatedAt'], DECISION_POINT.updated_at)

    assert_that(decision_point['clinician'], not_none())
    assert_that(
        decision_point['clinician']['id'],
        equal_to(str(context.USER.id))
    )
    assert_that(
        decision_point['clinician']['username'],
        equal_to(context.USER.username)
    )

    assert_that(decision_point['onPathway'], not_none())
    assert_that(decision_point['onPathway']['id'], str(equal_to(ONPATHWAY.id)))
    assert_that(decision_point['onPathway']['pathway'], not_none())
    assert_that(
        decision_point['onPathway']['pathway']['id'],
        equal_to(str(context.PATHWAY.id))
    )
    assert_that(
        decision_point['onPathway']['pathway']['name'],
        equal_to(context.PATHWAY.name)
    )

    assert_that(decision_point['milestones'][0], not_none())
    assert_that(decision_point['milestones'][0]['id'], not_none())
    assert_that(decision_point['milestones'][0]['milestoneType'], not_none())
    assert_that(
        decision_point['milestones'][0]['milestoneType']['id'],
        context.MILESTONE_TYPE.id)
    assert_that(
        decision_point['milestones'][0]['milestoneType']['name'],
        context.MILESTONE_TYPE.name)
    assert_that(decision_point['milestones'][0]['testResult'], none())
    assert_that(decision_point['milestoneResolutions'], not_none())
    assert_that(decision_point['milestoneResolutions'][0], not_none())
    assert_that(decision_point['milestoneResolutions'][0]['id'], not_none())