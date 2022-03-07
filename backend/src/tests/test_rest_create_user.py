import json
import pytest
from random import randint
from models import *
from hamcrest import *

# Feature: User account operations
# Scenario: a new user needs to be added into the system
@pytest.mark.asyncio
async def test_add_new_patient_to_system(context):
    """
    When: we create their user account
    """
    NEW_CLINICIAN={
        "firstName": "JOHN",
        "lastName": "SMITH",
        "username": f"JOHN.SMITH{randint(1000,9999)}",
        "password": "VERYSECUREPASSWORD",
        "department": "ONCOLOGY",
    }

    create_user_account=await context.client.post(
        url="rest/createuser/",
        json={
            "username":NEW_CLINICIAN['username'],
            "password":NEW_CLINICIAN['password'],
            "firstName":NEW_CLINICIAN['firstName'],
            "lastName":NEW_CLINICIAN['lastName'],
            "department":NEW_CLINICIAN['department'],
            "defaultPathwayId":context.PATHWAY.id
        }
    )
    assert_that(create_user_account.status_code, equal_to(200))
    assert "error" not in json.loads(create_user_account.text)
    user_result=json.loads(create_user_account.text)

    assert user_result['username']==NEW_CLINICIAN['username']
    assert user_result['first_name']==NEW_CLINICIAN['firstName']
    assert user_result['last_name']==NEW_CLINICIAN['lastName']
    assert user_result['department']==NEW_CLINICIAN['department']
    assert user_result['default_pathway_id']==context.PATHWAY.id
