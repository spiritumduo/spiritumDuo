from behave import *
from hamcrest import *
import json
from datetime import datetime
from random import randint
from trustadapter.trustadapter import Patient_IE

CREATE_USER_REST_ENDPOINT="http://localhost:8080/rest/createuser/"
LOGIN_REST_ENDPOINT="http://localhost:8080/rest/login/"
GRAPHQL_ENDPOINT="graphql"
PATIENT={
    "id": 1,
    "firstName": "JOHN",
    "lastName": "DOE",
    "dateOfBirth": datetime(year=2000, month=1, day=1).date(),
    "hospitalNumber": f"MRN{randint(1000000,9999999)}",
    "nationalNumber": str(randint(1000000000,9999999999)),
    "communicationMethod": "LETTER"
}
PATHWAY={
    "name": f"BRONCHIECTASIS{randint(1000,9999)}"
}
DECISION_POINT={
    "decisionType": "TRIAGE",
    "clinicHistory": "This is the clinical history",
    "comorbidities": "These are the comorbidities",
    "requestsReferrals": "These are the requests and referrals"
}

##### SCENARIO: A NEW PATIENT NEEDS TO BE ADDED INTO THE SYSTEM #####
@given("a pathway exists")
def step_impl(context): 
    """
    this is a prerequisite because you cannot add
    a patient and not have them on a pathway.
    Usually this would have been done prior to a
    patient being added to a pathway
    """
    create_pathway_result = context.client.post(
        url=GRAPHQL_ENDPOINT,
        json={
            "query": """
                mutation createPathway($name: String!){
                    createPathway(input: {
                        name: $name
                    }){
                        pathway{
                            id
                            name
                        }
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "name": PATHWAY['name']
            }
        }
    )

    assert_that(create_pathway_result.status_code, equal_to(200))  # check that there are no HTTP errors
    user_errors = json.loads(create_pathway_result.text)['data']['createPathway']['userErrors']
    assert_that(user_errors, none())  # check that there are no input errors
    pathway_id = json.loads(create_pathway_result.text)['data']['createPathway']['pathway']['id']
    assert_that(pathway_id, not_none())  # check that an ID has been returned

    PATHWAY['id']=int(json.loads(create_pathway_result.text)['data']['createPathway']['pathway']['id']) # set the ID in context for future use

@when("we run the GraphQL mutation to add the patient")
def step_impl(context): 

    context.trust_adapter_mock.load_patient.return_value=Patient_IE(
        first_name = PATIENT['firstName'],
        last_name = PATIENT['lastName'],
        date_of_birth = PATIENT['dateOfBirth'],
        hospital_number = PATIENT['hospitalNumber'],
        national_number = PATIENT['nationalNumber'],
        communication_method = PATIENT["communicationMethod"],
        id = PATIENT['id']
    )
        
    context.trust_adapter_mock.load_many_patients.return_value=[Patient_IE(
        first_name = PATIENT['firstName'],
        last_name = PATIENT['lastName'],
        date_of_birth = PATIENT['dateOfBirth'],
        hospital_number = PATIENT['hospitalNumber'],
        national_number = PATIENT['nationalNumber'],
        communication_method = PATIENT["communicationMethod"],
        id = PATIENT['id']
    )]
    context.trust_adapter_mock.create_patient.return_value=Patient_IE(
        first_name = PATIENT['firstName'],
        last_name = PATIENT['lastName'],
        date_of_birth = PATIENT['dateOfBirth'],
        hospital_number = PATIENT['hospitalNumber'],
        national_number = PATIENT['nationalNumber'],
        communication_method = PATIENT["communicationMethod"],
        id = PATIENT['id']
    )


    create_patient_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        json={
            "query": """
                mutation createPatient(
                    $firstName: String!
                    $lastName: String!
                    $hospitalNumber: String!
                    $nationalNumber: String!
                    $dateOfBirth: Date!
                    $pathwayId: ID!
                ){
                    createPatient(input: {
                        firstName: $firstName,
                        lastName: $lastName,
                        hospitalNumber: $hospitalNumber,
                        nationalNumber: $nationalNumber,
                        dateOfBirth: $dateOfBirth,
                        pathwayId: $pathwayId
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
                            }
                        }
                        userErrors{
                            field
                            message
                        }
                    }
                }
            """,
            "variables": {
                "firstName": PATIENT['firstName'],
                "lastName": PATIENT['lastName'],
                "hospitalNumber": PATIENT['hospitalNumber'],
                "nationalNumber": PATIENT['nationalNumber'],
                "dateOfBirth": PATIENT['dateOfBirth'].isoformat(),
                "pathwayId": PATHWAY['id']
            }
        }
    )
    assert_that(create_patient_result.status_code, equal_to(200)) # check the HTTP status for 200 OK
    assert json.loads(create_patient_result.text)['data']['createPatient']['userErrors']==None # make sure there are no input errors
    assert json.loads(create_patient_result.text)['data']['createPatient']['patient']['id']!=None # check that an id has been returned
    assert json.loads(create_patient_result.text)['data']['createPatient']['patient']['hospitalNumber']!=None # check that the hospital number has been returned
    context.patient_record=json.loads(create_patient_result.text)['data']['createPatient']['patient'] # save entire record for future use
    PATIENT['id']=json.loads(create_patient_result.text)['data']['createPatient']['patient']['id']
    PATIENT['onPathwayId']=json.loads(create_patient_result.text)['data']['createPatient']['patient']['onPathways'][0]['id']

@then("we get the patient's record")
def step_impl(context):
    assert context.patient_record['id']!=None
    assert context.patient_record['firstName']==PATIENT['firstName']
    assert context.patient_record['lastName']==PATIENT['lastName']
    assert context.patient_record['hospitalNumber']==PATIENT['hospitalNumber']
    assert context.patient_record['nationalNumber']==PATIENT['nationalNumber']
    assert context.patient_record['dateOfBirth']==PATIENT['dateOfBirth'].isoformat()


##### SCENARIO: A PATIENT NEEDS A DECISION POINT ADDED #####
@when("we run the GraphQL mutation to add the decision point")
def step_impl(context):
    create_decision_point_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        # TODO: Add milestone requests to this mutation
        json={
            "query": """
                mutation createDecisionPoint(
                    $onPathwayId: ID!
                    $decisionType: DecisionType!
                    $clinicHistory: String!
                    $comorbidities: String!
                ){
                    createDecisionPoint(input: {
                        onPathwayId: $onPathwayId,
                        decisionType: $decisionType,
                        clinicHistory: $clinicHistory,
                        comorbidities: $comorbidities,
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
                                currentState
                                milestoneType {
                                    id
                                    refName
                                    name
                                }
                            }
                            decisionType
                            clinicHistory
                            comorbidities
                        }
                        
                        userErrors {
                            message
                            field
                        }
                    }
                }
            """,
            "variables": {
                "onPathwayId":PATIENT['onPathwayId'],
                "decisionType":DECISION_POINT['decisionType'],
                "clinicHistory":DECISION_POINT['clinicHistory'],
                "comorbidities":DECISION_POINT['comorbidities'],
            }
        }
    )

    assert_that(create_decision_point_result.status_code, equal_to(200))
    assert json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['id']!=None # check that an id has been returned
    context.patient_record_from_decision_point=json.loads(create_decision_point_result.text)['data']['createDecisionPoint'] # save entire record for future use

@then("we get the decision point record")
def step_impl(context):
    assert context.patient_record_from_decision_point['decisionPoint']['id']!=None
    assert context.patient_record_from_decision_point['decisionPoint']['decisionType']==DECISION_POINT['decisionType']
    assert context.patient_record_from_decision_point['decisionPoint']['clinicHistory']==DECISION_POINT['clinicHistory']
    assert context.patient_record_from_decision_point['decisionPoint']['comorbidities']==DECISION_POINT['comorbidities']
    DECISION_POINT['id']=context.patient_record_from_decision_point['decisionPoint']['id'] # save ID in decision point object

@when("we run the query to search for the patient")
def step_impl(context):
    get_patient_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        json={
            "query":"""
                query getPatient($id:ID!){
                    getPatient(id:$id){
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
                                firstName
                                lastName
                                hospitalNumber
                                nationalNumber
                                communicationMethod
                                dateOfBirth
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
                                clinician{
                                    id
                                }
                                onPathway{
                                    id
                                }
                                decisionType
                                addedAt
                                updatedAt
                                clinicHistory
                                comorbidities
                                milestones{
                                    id
                                }
                            }
                        }
                    }
                }
            """,
            "variables":{
                "id":PATIENT['id'],
            }
        }
    )
    assert_that(get_patient_result.status_code, equal_to(200))
    assert json.loads(get_patient_result.text)['data']['getPatient']!=None
    context.get_patient_result=json.loads(get_patient_result.text)['data']['getPatient']
    print(context.get_patient_result)

@then("we get the patient's record with the decision point and pathway")
def step_impl(context):
    assert_that(context.get_patient_result, not_none())

    patient=context.get_patient_result

    assert_that(patient['firstName'], equal_to(PATIENT['firstName']))
    assert_that(patient['lastName'], equal_to(PATIENT['lastName']))
    assert_that(patient['hospitalNumber'], equal_to(PATIENT['hospitalNumber']))
    assert_that(patient['nationalNumber'], equal_to(PATIENT['nationalNumber']))
    assert_that(str(patient['dateOfBirth']), equal_to(PATIENT['dateOfBirth'].isoformat()))

    onPathway=patient['onPathways'][0]
    assert_that(onPathway, not_none())
    onPathway_Patient=onPathway['patient']

    assert_that(onPathway_Patient['firstName'], equal_to(PATIENT['firstName']))
    assert_that(onPathway_Patient['lastName'], equal_to(PATIENT['lastName']))
    assert_that(onPathway_Patient['hospitalNumber'], equal_to(PATIENT['hospitalNumber']))
    assert_that(onPathway_Patient['nationalNumber'], equal_to(PATIENT['nationalNumber']))
    assert_that(str(onPathway_Patient['dateOfBirth']), equal_to(PATIENT['dateOfBirth'].isoformat()))

    onPathway_Pathway=onPathway['pathway']
    assert_that(onPathway_Pathway['name'], equal_to(PATHWAY['name']))

    onPathway_DecisionPoint=onPathway['decisionPoints'][0]
    assert_that(onPathway_DecisionPoint, not_none())

    assert_that(onPathway_DecisionPoint['decisionType'], equal_to(DECISION_POINT['decisionType']))
    assert_that(onPathway_DecisionPoint['clinicHistory'], equal_to(DECISION_POINT['clinicHistory']))
    assert_that(onPathway_DecisionPoint['comorbidities'], equal_to(DECISION_POINT['comorbidities']))