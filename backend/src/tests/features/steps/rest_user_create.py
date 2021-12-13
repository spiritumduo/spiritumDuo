from behave import *
import requests, json
from random import randint

@given('we have valid user information')
def step_impl(context):
    context.rest_endpoint="http://localhost:8080/rest/createuser"
    context.user_firstname="JOHN"
    context.user_lastname="DOE"
    context.user_password="VERYSECUREPASSWORD"
    context.user_username=f"JOHN.DOE{randint(1,1000)}"
    context.user_department="TEST DEPT"

@when('we create their user account')
def step_impl(context):
    create_user_result=requests.post(
        url=context.rest_endpoint,
        json={
            "username":context.user_username,
            "password":context.user_password,
            "firstName":context.user_firstname,
            "lastName":context.user_lastname,
            "department":context.user_department
        }
    )
    assert create_user_result.status_code==200
    assert "error" not in json.loads(create_user_result.text)
    context.user_result=json.loads(create_user_result.text)

@then('we get the user\'s ID')
def step_impl(context):
    assert context.user_result['id'] is not None
    assert context.user_result['username']==context.user_username