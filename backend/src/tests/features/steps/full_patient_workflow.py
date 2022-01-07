from behave import *
import json
from random import randint

GRAPHQL_ENDPOINT="graphql"
PATIENT={
    "firstName": "JOHN",
    "lastName": "DOE",
    "dateOfBirth": "2000-01-01",
    "hospitalNumber": f"MRN{randint(1000000,9999999)}",
    "nationalNumber": str(randint(1000000000,9999999999)),
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
    create_pathway_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        cookies=context.user.cookies,
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

    assert create_pathway_result.status_code==200 # check that there are no HTTP errors
    assert json.loads(create_pathway_result.text)['data']['createPathway']['userErrors']==None # check that there are no input errors
    assert json.loads(create_pathway_result.text)['data']['createPathway']['pathway']['id']!=None # check that an ID has been returned

    PATHWAY['id']=int(json.loads(create_pathway_result.text)['data']['createPathway']['pathway']['id']) # set the ID in context for future use

@when("we run the GraphQL mutation to add the patient")
def step_impl(context): 
    create_patient_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        cookies=context.user.cookies,
        json={
            "query": """
                mutation createPatient(
                    $firstName: String!
                    $lastName: String!
                    $hospitalNumber: String!
                    $nationalNumber: String!
                    $dateOfBirth: Date!
                    $pathwayId: Int!
                ){
                    createPatient(input: {
                        firstName: $firstName,
                        lastName: $lastName,
                        hospitalNumber: $hospitalNumber,
                        nationalNumber: $nationalNumber,
                        dateOfBirth: $dateOfBirth,
                        pathway: $pathwayId
                    }){
                        patient{
                            id
                            firstName
                            lastName
                            hospitalNumber
                            nationalNumber
                            dateOfBirth
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
                "dateOfBirth": PATIENT['dateOfBirth'],
                "pathwayId": PATHWAY['id']
            }
        }
    )

    assert create_patient_result.status_code==200 # check the HTTP status for 200 OK
    assert json.loads(create_patient_result.text)['data']['createPatient']['userErrors']==None # make sure there are no input errors
    assert json.loads(create_patient_result.text)['data']['createPatient']['patient']['id']!=None # check that an id has been returned
    assert json.loads(create_patient_result.text)['data']['createPatient']['patient']['hospitalNumber']!=None # check that the hospital number has been returned
    context.patient_record=json.loads(create_patient_result.text)['data']['createPatient']['patient'] # save entire record for future use
    PATIENT['id']=json.loads(create_patient_result.text)['data']['createPatient']['patient']['id']

@then("we get the patient's record")
def step_impl(context):
    assert context.patient_record['id']!=None
    assert context.patient_record['firstName']==PATIENT['firstName']
    assert context.patient_record['lastName']==PATIENT['lastName']
    assert context.patient_record['hospitalNumber']==PATIENT['hospitalNumber']
    assert context.patient_record['nationalNumber']==PATIENT['nationalNumber']
    assert context.patient_record['dateOfBirth']==PATIENT['dateOfBirth']


##### SCENARIO: A PATIENT NEEDS A DECISION POINT ADDED #####
@when("we run the GraphQL mutation to add the decision point")
def step_impl(context): 
    create_decision_point_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        cookies=context.user.cookies,
        json={
            "query": """
                mutation createDecisionPoint(
                    $patientId: Int!
                    $clinicianId: Int!
                    $pathwayId: Int!
                    $decisionType: DecisionType!
                    $clinicHistory: String!
                    $comorbidities: String!
                    $requestsReferrals: String!
                ){
                    createDecisionPoint(input: {
                        patientId: $patientId,
                        clinicianId: $clinicianId,
                        pathwayId: $pathwayId,
                        decisionType: $decisionType,
                        clinicHistory: $clinicHistory,
                        comorbidities: $comorbidities,
                        requestsReferrals: $requestsReferrals,
                    }){
                        id
                        patient{
                            id
                            hospitalNumber
                        }
                        clinician{
                            id
                            username
                        }
                        pathway{
                            id
                            name
                        }
                        decisionType
                        clinicHistory
                        comorbidities
                        requestsReferrals
                    }
                }
            """,
            "variables": {
                "patientId":int(PATIENT['id']),
                "clinicianId":int(context.user.id),
                "pathwayId":int(PATHWAY['id']),
                "decisionType":DECISION_POINT['decisionType'],
                "clinicHistory":DECISION_POINT['clinicHistory'],
                "comorbidities":DECISION_POINT['comorbidities'],
                "requestsReferrals":DECISION_POINT['requestsReferrals']
            }
        }
    )

    assert create_decision_point_result.status_code==200 # check the HTTP status for 200 OK
    
    assert json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['id']!=None # check that an id has been returned
    context.patient_record_from_decision_point=json.loads(create_decision_point_result.text)['data']['createDecisionPoint'] # save entire record for future use

@then("we get the decision point record")
def step_impl(context):
    assert context.patient_record_from_decision_point['id']!=None
    assert context.patient_record_from_decision_point['decisionType']==DECISION_POINT['decisionType']
    assert context.patient_record_from_decision_point['clinicHistory']==DECISION_POINT['clinicHistory']
    assert context.patient_record_from_decision_point['comorbidities']==DECISION_POINT['comorbidities']
    assert context.patient_record_from_decision_point['requestsReferrals']==DECISION_POINT['requestsReferrals']
    DECISION_POINT['id']=context.patient_record_from_decision_point['id'] # save ID in decision point object

@when("we run the query to search for the patient")
def step_impl(context):
    get_patient_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        cookies=context.user.cookies,
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
                        
                        decisionPoints{
                            id
                            clinician{
                                id
                                username
                            }
                            pathway{
                                id
                                name
                            }
                            decisionType
                            clinicHistory
                            comorbidities
                            requestsReferrals
                        }

                        pathways{
                            id
                            pathway{
                                id
                                name
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
    assert get_patient_result.status_code==200
    assert json.loads(get_patient_result.text)['data']['getPatient']!=None
    context.get_patient_result=json.loads(get_patient_result.text)['data']['getPatient']

@then("we get the patient's record with the decision point and pathway")
def step_impl(context):
    assert context.get_patient_result!=None
    assert context.get_patient_result['decisionPoints']!=None
    assert context.get_patient_result['decisionPoints'][0]['clinician']!=None
    assert int(context.get_patient_result['decisionPoints'][0]['clinician']['id'])==int(context.user.id)
    assert context.get_patient_result['decisionPoints'][0]['clinician']['username']==context.user.username
    assert context.get_patient_result['decisionPoints'][0]['decisionType']==DECISION_POINT['decisionType']
    assert context.get_patient_result['decisionPoints'][0]['clinicHistory']==DECISION_POINT['clinicHistory']
    assert context.get_patient_result['decisionPoints'][0]['comorbidities']==DECISION_POINT['comorbidities']
    assert context.get_patient_result['decisionPoints'][0]['requestsReferrals']==DECISION_POINT['requestsReferrals']
    assert context.get_patient_result['decisionPoints'][0]['pathway']!=None
    assert context.get_patient_result['decisionPoints'][0]['pathway']['name']==PATHWAY['name']
    assert context.get_patient_result['pathways']!=None
    assert context.get_patient_result['pathways'][0]['pathway']['name']==PATHWAY['name']