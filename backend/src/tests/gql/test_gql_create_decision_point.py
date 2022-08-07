import json
from typing import List
import pytest
from datetime import datetime
from random import randint
from tests.conftest import UserFixture
from models import (
    Patient, OnPathway, DecisionPoint, ClinicalRequest,
    ClinicalRequestType, PathwayClinicalRequestType,
    OnMdt, Pathway, MDT
)
from trustadapter.trustadapter import Patient_IE, TestResult_IE
from SdTypes import DecisionTypes, ClinicalRequestState
from hamcrest import assert_that, equal_to, not_none, none, contains_string


@pytest.fixture
def decision_query() -> str:
    return """
        mutation createDecisionPoint(
            $onPathwayId: ID!
            $decisionType: DecisionType!
            $clinicHistory: String!
            $comorbidities: String!
            $clinicalRequestOneId: ID!
            $clinicalRequestResolutionId: ID!
            $mdtId: ID!
            $mdtAddReason: String!
            $clinicalRequestMdtId: ID!
            $fromMdtId: ID
        ){
            createDecisionPoint(input: {
                onPathwayId: $onPathwayId
                decisionType: $decisionType
                clinicHistory: $clinicHistory
                comorbidities: $comorbidities
                clinicalRequestRequests:[
                    {
                        clinicalRequestTypeId: $clinicalRequestOneId
                    },
                    {
                        clinicalRequestTypeId: $clinicalRequestMdtId
                    }
                ]
                clinicalRequestResolutions:[
                    $clinicalRequestResolutionId
                ]
                mdt: {
                    id: $mdtId
                    reason: $mdtAddReason
                }
                fromMdtId: $fromMdtId
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
                        patient{
                            onMdts(id: $mdtId){
                                id
                                reason
                            }
                        }
                    }
                    clinicalRequests{
                        id
                        clinicalRequestType{
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
                    clinicalRequestResolutions{
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
    """


# Scenario: a patient needs a decision point added and clinical_requests
# requested
@pytest.mark.asyncio
async def test_add_decision_point_to_patient(
    mock_trust_adapter, test_user: UserFixture,
    decision_create_permission,
    clinical_request_create_permission, decision_query,
    test_pathway: Pathway, test_clinical_request_type,
    httpx_test_client, httpx_login_user,
    on_mdt_create_permission, test_mdts: List[MDT]
):
    """
    When: we run the GraphQL mutation to add the decision point and
    clinical_requests
    """
    mock_trust_adapter.test_connection.return_value = True

    PATIENT: Patient = await Patient.create(
        hospital_number=f"fMRN{randint(100000,999999)}",
        national_number=f"fNHS{randint(100000000,999999999)}",
    )

    ONPATHWAY: OnPathway = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id,
        is_discharged=False,
        lock_user_id=test_user.user.id,
        lock_end_time=datetime(2030, 1, 1, 3, 0, 0)
    )

    FIRST_MILESTONE: ClinicalRequest = await ClinicalRequest.create(
        on_pathway_id=ONPATHWAY.id,
        test_result_reference_id="1000",
        clinical_request_type_id=test_clinical_request_type.id
    )

    DECISION_POINT: DecisionPoint = DecisionPoint(
        clinician_id=test_user.user.id,
        on_pathway_id=ONPATHWAY.id,
        decision_type=DecisionTypes.TRIAGE,
        clinic_history="Test data blah blah blah",
        comorbidities="Test data go brrrrrrt"
    )

    FIRST_TEST_RESULT: TestResult_IE = TestResult_IE(
        id=1000,
        current_state=ClinicalRequestState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=test_clinical_request_type.ref_name,
    )
    SECOND_TEST_RESULT: TestResult_IE = TestResult_IE(
        id=2000,
        current_state=ClinicalRequestState.INIT,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=test_clinical_request_type.ref_name,
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
        return Patient_IE(
            first_name="Test",
            last_name="User",
            hospital_number=PATIENT.hospital_number,
            national_number=PATIENT.national_number,
            date_of_birth=datetime(year=2000, month=1, day=1).date(),
            communication_method="LETTER"
        )
    mock_trust_adapter.load_patient = load_patient

    mdt_type: ClinicalRequestType = await ClinicalRequestType.create(
        name="mdt type",
        ref_name="mdt_type",
        is_mdt=True
    )

    await PathwayClinicalRequestType.create(
        pathway_id=test_pathway.id,
        clinical_request_type_id=mdt_type.id
    )

    mdt_clinical_request: ClinicalRequest = await ClinicalRequest.create(
        on_pathway_id=ONPATHWAY.id,
        clinical_request_type_id=mdt_type.id
    )

    on_mdt: OnMdt = await OnMdt.create(
        mdt_id=test_mdts[1].id,
        patient_id=PATIENT.id,
        user_id=test_user.user.id,
        reason="test reason",
        outcome="test outcome",
        clinical_request_id=mdt_clinical_request.id,
        order=0,
    )

    create_decision_point_result = await httpx_test_client.post(
        url="graphql",
        json={
            "query": decision_query,
            "variables": {
                "onPathwayId": ONPATHWAY.id,
                "decisionType": DECISION_POINT.decision_type.value,
                "clinicHistory": DECISION_POINT.clinic_history,
                "comorbidities": DECISION_POINT.comorbidities,
                "clinicalRequestOneId": test_clinical_request_type.id,
                "clinicalRequestResolutionId": FIRST_MILESTONE.id,
                "mdtAddReason": "this is a test reason",
                "mdtId": test_mdts[0].id,
                "clinicalRequestMdtId": mdt_type.id,
                "fromMdtId": test_mdts[1].id,
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

    print(decision_point)

    assert_that(decision_point, not_none())
    assert_that(decision_point['id'], not_none())
    assert_that(decision_point['decisionType'], DECISION_POINT.decision_type)
    assert_that(decision_point['clinicHistory'], DECISION_POINT.clinic_history)
    assert_that(decision_point['comorbidities'], DECISION_POINT.comorbidities)
    assert_that(decision_point['addedAt'], DECISION_POINT.added_at)
    assert_that(decision_point['updatedAt'], DECISION_POINT.updated_at)

    assert_that(decision_point['clinician'], not_none())
    assert_that(
        decision_point['clinician']['id'],
        equal_to(str(test_user.user.id))
    )
    assert_that(
        decision_point['clinician']['username'],
        equal_to(test_user.user.username)
    )

    assert_that(decision_point['onPathway'], not_none())
    assert_that(decision_point['onPathway']['id'], str(equal_to(ONPATHWAY.id)))
    assert_that(decision_point['onPathway']['pathway'], not_none())
    assert_that(
        decision_point['onPathway']['pathway']['id'],
        equal_to(str(test_pathway.id))
    )
    assert_that(
        decision_point['onPathway']['pathway']['name'],
        equal_to(test_pathway.name)
    )

    assert_that(decision_point['clinicalRequests'][0], not_none())
    assert_that(decision_point['clinicalRequests'][0]['id'], not_none())
    assert_that(
        decision_point['clinicalRequests'][0]['clinicalRequestType'],
        not_none()
    )
    assert_that(
        decision_point['clinicalRequests'][0]['clinicalRequestType']['id'],
        test_clinical_request_type.id)
    assert_that(
        decision_point['clinicalRequests'][0]['clinicalRequestType']['name'],
        test_clinical_request_type.name)
    assert_that(decision_point['clinicalRequests'][0]['testResult'], none())
    assert_that(decision_point['clinicalRequestResolutions'], not_none())
    assert_that(decision_point['clinicalRequestResolutions'][0], not_none())
    assert_that(
        decision_point['clinicalRequestResolutions'][0]['id'], not_none()
    )
    assert_that(
        decision_point['onPathway']['patient']['onMdts'],
        not_none()
    )
    assert_that(
        decision_point['onPathway']['patient']['onMdts'][0]['reason'],
        equal_to("this is a test reason")
    )

    check_on_mdt_clinical_request: ClinicalRequest = await ClinicalRequest.\
        join(
            OnMdt, OnMdt.clinical_request_id == ClinicalRequest.id
        ).select().where(OnMdt.id == on_mdt.id).gino.one_or_none()

    assert_that(
        check_on_mdt_clinical_request.current_state,
        equal_to(ClinicalRequestState.COMPLETED)
    )


async def test_user_lacks_permission(login_user, test_client, decision_query):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": decision_query,
            "variables": {
                "onPathwayId": "1",
                "decisionType": "TRIAGE",
                "clinicHistory": "test",
                "comorbidities": "test",
                "clinicalRequestOneId": "1",
                "clinicalRequestResolutionId": "1",
                "mdtAddReason": "this is a test reason",
                "mdtId": "42",
                "clinicalRequestMdtId": "1",
                "fromMdtId": "42"
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
