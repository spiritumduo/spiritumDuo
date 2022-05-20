import pytest
from models import OnPathway, Patient, User
from hamcrest import assert_that, equal_to, not_none, none, contains_string
from trustadapter.trustadapter import Patient_IE
from json import loads
from datetime import datetime, timedelta
# TODO: add test to ensure errors if locking twice


@pytest.fixture
def on_pathway_lock_mutation() -> str:
    return """
        mutation lockOnPathway(
            $onPathwayId: ID!
        ){
            lockOnPathway(
                input:{
                    onPathwayId: $onPathwayId
                }
            ){
                onPathway{
                    id
                    lockUser{
                        id
                        username
                    }
                    lockEndTime
                }
                userErrors{
                    field
                    message
                }
            }
        }
    """


# Feature: testing lockOnPathway
# Scenario: an OnPathway record needs to be locked to a user
@pytest.mark.asyncio
async def test_lock_on_pathway(
        on_pathway_update_permission,
        on_pathway_read_permission,
        on_pathway_lock_mutation,
        mock_trust_adapter,
        test_pathway,
        httpx_test_client,
        httpx_login_user,
        test_user
):
    mock_trust_adapter.test_connection.return_value = True
    """
    Given we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456"
    )
    PATIENT_IE = Patient_IE(
        hospital_number="fMRN123456",
        national_number="fNHS12345678",
        first_name="Test",
        last_name="Dummy",
        date_of_birth="2000-01-01"
    )
    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id
    )

    async def load_patient(): return PATIENT_IE
    async def load_many_patients(): return [PATIENT_IE]
    mock_trust_adapter.load_patient = load_patient
    mock_trust_adapter.load_many_patients = load_many_patients

    """
    When: we run the GQL mutation to lock an OnPathway record
    """
    lock_on_pathway_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": on_pathway_lock_mutation,
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

    userErrors = result['userErrors']
    assert_that(userErrors, none())

    onPathway = result['onPathway']
    assert_that(onPathway['id'], equal_to(str(ONPATHWAY.id)))
    lockUser = onPathway['lockUser']
    assert_that(lockUser, not_none())
    assert_that(lockUser['id'], equal_to(str(test_user.user.id)))
    assert_that(lockUser['username'], equal_to(test_user.user.username))

    assert_that(onPathway['lockEndTime'], not_none())


# Scenario: an OnPathway record needs to be unlocked
@pytest.mark.asyncio
async def test_unlock_lock_on_pathway(
    on_pathway_update_permission,
    on_pathway_read_permission,
    mock_trust_adapter,
    test_pathway, test_user,
    httpx_test_client, httpx_login_user
):
    mock_trust_adapter.test_connection.return_value = True
    """
    Given we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456"
    )
    PATIENT_IE = Patient_IE(
        hospital_number="fMRN123456",
        national_number="fNHS12345678",
        first_name="Test",
        last_name="Dummy",
        date_of_birth="2000-01-01"
    )
    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id,
        lock_user_id=test_user.user.id,
        lock_end_time=datetime.now()+timedelta(seconds=60)
    )

    async def load_patient(): return PATIENT_IE
    async def load_many_patients(): return [PATIENT_IE]
    mock_trust_adapter.load_patient = load_patient
    mock_trust_adapter.load_many_patients = load_many_patients
    """
    When: we run the GQL mutation to unlock an OnPathway record
    """
    unlock_lock_on_pathway_mutation = await httpx_test_client.post(
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
                        onPathway{
                            id
                            lockUser{
                                id
                                username
                            }
                            lockEndTime
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

    userErrors = result['userErrors']
    assert_that(userErrors, none())

    onPathway = result['onPathway']
    assert_that(onPathway['id'], equal_to(str(ONPATHWAY.id)))
    assert_that(onPathway['lockUser'], none())

    assert_that(onPathway['lockEndTime'], none())


# Scenario: attempted onPathway lock while already being locked
@pytest.mark.asyncio
async def test_locked_lock_on_pathway(
        on_pathway_update_permission,
        on_pathway_read_permission,
        on_pathway_lock_mutation,
        mock_trust_adapter,
        test_pathway,
        httpx_test_client, httpx_login_user
):
    mock_trust_adapter.test_connection.return_value = True
    """
    Given we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456"
    )
    PATIENT_IE = Patient_IE(
        hospital_number="fMRN123456",
        national_number="fNHS12345678",
        first_name="Test",
        last_name="Dummy",
        date_of_birth="2000-01-01"
    )
    USER = User(
        first_name="doctor",
        last_name="dolittle",
        department="talking to anumals department",
        username="ddolittle",
        password="insertanimalnoisehere"
    )
    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id,
        lock_user_id=USER.id,
        lock_end_time=datetime.now()+timedelta(seconds=60)
    )

    async def load_patient(): return PATIENT_IE
    async def load_many_patients(): return [PATIENT_IE]
    mock_trust_adapter.load_patient = load_patient
    mock_trust_adapter.load_many_patients = load_many_patients

    """
    When: we run the GQL mutation to lock an OnPathway record
    """
    lock_on_pathway_mutation = await httpx_test_client.post(
        url="graphql",
        json={
            "query": on_pathway_lock_mutation,
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
    onPathway = result['onPathway']
    assert_that(onPathway, not_none())

    userErrors = result['userErrors']
    assert_that(userErrors, not_none())
    assert_that(userErrors[0]['field'], equal_to("lock_end_time"))


# Scenario: attempted onPathway unlock while locked by someone else
@pytest.mark.asyncio
async def test_unlocked_locked_lock_on_pathway(
    on_pathway_update_permission,
    on_pathway_read_permission,
    mock_trust_adapter,
    test_pathway, httpx_login_user,
    httpx_test_client
):
    mock_trust_adapter.test_connection.return_value = True
    """
    Given we have a patient on a pathway
    """
    PATIENT = await Patient.create(
        hospital_number="fMRN123456",
        national_number="fNHS123456"
    )
    PATIENT_IE = Patient_IE(
        hospital_number="fMRN123456",
        national_number="fNHS12345678",
        first_name="Test",
        last_name="Dummy",
        date_of_birth="2000-01-01"
    )
    USER = User(
        first_name="doctor",
        last_name="dolittle",
        department="talking to anumals department",
        username="ddolittle",
        password="insertanimalnoisehere"
    )
    ONPATHWAY = await OnPathway.create(
        patient_id=PATIENT.id,
        pathway_id=test_pathway.id,
        lock_user_id=USER.id,
        lock_end_time=datetime.now()+timedelta(seconds=60)
    )

    async def load_patient(): return PATIENT_IE
    async def load_many_patients(): return [PATIENT_IE]
    mock_trust_adapter.load_patient = load_patient
    mock_trust_adapter.load_many_patients = load_many_patients

    """
    When: we run the GQL mutation to lock an OnPathway record
    """
    lock_on_pathway_mutation = await httpx_test_client.post(
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
                        onPathway{
                            id
                            lockUser{
                                id
                                username
                            }
                            lockEndTime
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
                "unlock": True
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
    onPathway = result['onPathway']
    assert_that(onPathway, not_none())

    userErrors = result['userErrors']
    assert_that(userErrors, not_none())
    assert_that(userErrors[0]['field'], equal_to("lock_user_id"))


async def test_user_lacks_permission(
    login_user, test_client,
    on_pathway_lock_mutation
):
    """
    Given the user's test role lacks the required permission
    """
    res = await test_client.post(
        path="/graphql",
        json={
            "query": on_pathway_lock_mutation,
            "variables": {
                "onPathwayId": "test"
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
