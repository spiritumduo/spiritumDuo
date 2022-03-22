import pytest
from models import OnPathway, Patient
from hamcrest import assert_that, equal_to, not_none, none
from trustadapter.trustadapter import Patient_IE
from json import loads


# Feature: testing lockOnPathway
# Scenario: an OnPathway record needs to be locked to a user
@pytest.mark.asyncio
async def test_lock_on_pathway(context):
    context.trust_adapter_mock.test_connection.return_value = True
    """
    Given we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456"
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
    When: we run the GQL mutation to lock an OnPathway record
    """
    lock_on_pathway_mutation = await context.client.post(
        url="graphql",
        json={
            "query": """
                mutation lockOnPathway(
                    $onPathwayId: ID!
                ){
                    lockOnPathway(
                        input:{
                            onPathwayId: $onPathwayId
                        }
                    ){
                        id
                        lockUser{
                            id
                            username
                        }
                        lockEndTime
                    }
                }
            """,
            "variables": {
                "onPathwayId": ONPATHWAY.id
            }
        }
    )
    assert_that(lock_on_pathway_mutation.status_code, equal_to(200))

    """
    Then: we get the OnPathway object
    """
    result = loads(
        lock_on_pathway_mutation.text
    )['data']['lockOnPathway']

    assert_that(result['id'], equal_to(str(ONPATHWAY.id)))
    lockUser = result['lockUser']
    assert_that(lockUser, not_none())
    assert_that(lockUser['id'], equal_to(str(context.USER.id)))
    assert_that(lockUser['username'], equal_to(context.USER.username))

    assert_that(result['lockEndTime'], not_none())

    """
    When: we run the GQL mutation to unlock an OnPathway record
    """
    unlock_lock_on_pathway_mutation = await context.client.post(
        url="graphql",
        json={
            "query": """
                mutation lockOnPathway(
                    $onPathwayId: ID!
                    $unlock: Boolean!
                ){
                    lockOnPathway(
                        input:{
                            onPathwayId: $onPathwayId
                            unlock: $unlock
                        }
                    ){
                        id
                        lockUser{
                            id
                            username
                        }
                        lockEndTime
                    }
                }
            """,
            "variables": {
                "onPathwayId": ONPATHWAY.id,
                "unlock": True
            }
        }
    )
    assert_that(unlock_lock_on_pathway_mutation.status_code, equal_to(200))

    """
    Then: we get the OnPathway object
    """
    result = loads(
        unlock_lock_on_pathway_mutation.text
    )['data']['lockOnPathway']

    assert_that(result['id'], equal_to(str(ONPATHWAY.id)))
    assert_that(result['lockUser'], none())

    assert_that(result['lockEndTime'], none())