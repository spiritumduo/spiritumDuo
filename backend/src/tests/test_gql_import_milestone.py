import json
import pytest
from models import Patient, OnPathway
from trustadapter.trustadapter import Patient_IE
from SdTypes import MilestoneState
from hamcrest import assert_that, equal_to, not_none


# Feature: testing importMilestone
# Scenario: a milestone has to be imported onto a patient;s record
@pytest.mark.asyncio
async def test_import_milestone(context):
    context.trust_adapter_mock.test_connection.return_value = True
    """
    Given: we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS12345678"
    )
    PATIENT_IE = Patient_IE(
        id=1000,
        hospital_number="fMRN123456",
        national_number="fNHS12345678",
        first_name="Test",
        last_name="Dummy",
        date_of_birth="2000-01-01"
    )

    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=context.PATHWAY.id
    )

    async def load_patient(): return PATIENT_IE
    async def load_many_patients(): return [PATIENT_IE]
    context.trust_adapter_mock.load_patient = load_patient
    context.trust_adapter_mock.load_many_patients = load_many_patients

    """
    When: we import a milestone onto the patient
    """

    import_milestone_mutation = await context.client.post(
        url="graphql",
        json={
            "query": """
                mutation importMilestone(
                    $onPathwayId: ID!
                    $milestoneTypeId: ID!
                    $description: String!
                    $currentState: MilestoneState!
                ){
                    importMilestone(input: {
                        onPathwayId: $onPathwayId,
                        milestoneTypeId: $milestoneTypeId,
                        description: $description,
                        currentState: $currentState
                    }){
                        milestone{
                            id
                        }
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "onPathwayId": ONPATHWAY.id,
                "milestoneTypeId": context.MILESTONE_TYPE.id,
                "description": "Test description go brrrrt",
                "currentState": MilestoneState.COMPLETED.value
            }
        }
    )

    assert_that(import_milestone_mutation.status_code, equal_to(200))
    import_milestone_mutation = json.loads(
        import_milestone_mutation.text
    )['data']['importMilestone']

    """
    Then: we get the milestone information back
    """
    assert_that(import_milestone_mutation['milestone']['id'], not_none())
