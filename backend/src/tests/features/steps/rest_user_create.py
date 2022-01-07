from behave import *
import json
from hamcrest import *
import requests, json
from random import randint
from behave.runner import Context

CREATE_USER_REST_ENDPOINT="/rest/createuser/"
NEW_CLINICIAN={
    "firstName": "JOHN",
    "lastName": "SMITH",
    "username": f"JOHN.SMITH{randint(1000,9999)}",
    "password": "VERYSECUREPASSWORD",
    "department": "ONCOLOGY",
}

@when('we create their user account')
def step_impl(context:Context):
    create_user_result=context.client.post(
        url=CREATE_USER_REST_ENDPOINT,
        cookies=context.user.cookies,
        json={
            "username":NEW_CLINICIAN['username'],
            "password":NEW_CLINICIAN['password'],
            "firstName":NEW_CLINICIAN['firstName'],
            "lastName":NEW_CLINICIAN['lastName'],
            "department":NEW_CLINICIAN['department']
        }
    )
    assert_that(create_user_result.status_code, equal_to(200))
    assert "error" not in json.loads(create_user_result.text)
    context.user_result=json.loads(create_user_result.text)

@then('we get the user\'s ID')
def step_impl(context):
    assert context.user_result['id'] is not None
    assert context.user_result['username']==NEW_CLINICIAN['username']