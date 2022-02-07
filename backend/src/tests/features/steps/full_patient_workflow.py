from behave import *
from hamcrest import *
import json
import asyncio
from SdTypes import MilestoneState, DecisionTypes
from models import Milestone
from datetime import datetime
from random import randint
from trustadapter.trustadapter import Patient_IE, Milestone_IE
import logging

CREATE_USER_REST_ENDPOINT="http://localhost:8080/rest/createuser/"
LOGIN_REST_ENDPOINT="http://localhost:8080/rest/login/"
GRAPHQL_ENDPOINT="graphql"
PATIENT={
    "id": 1,
    "firstName": "JOHN",
    "lastName": "DOE",
    "dateOfBirth": datetime(year=2000, month=1, day=1).date(),
    "hospitalNumber": f"fMRN{randint(1000000,9999999)}",
    "nationalNumber": f"fNHS{randint(1000000000,9999999999)}",
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
MILESTONE={
    "milestoneState":"INIT"
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

@when("we run the GraphQL mutation to add the patient onto the pathway")
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
    assert_that(json.loads(create_patient_result.text)['data']['createPatient']['userErrors'], none()) # make sure there are no input errors
    assert_that(json.loads(create_patient_result.text)['data']['createPatient']['patient']['id'], not_none()) # check that an id has been returned
    assert_that(json.loads(create_patient_result.text)['data']['createPatient']['patient']['hospitalNumber'], not_none()) # check that the hospital number has been returned
    assert_that(json.loads(create_patient_result.text)['data']['createPatient']['patient']['onPathways'][0]['id'], not_none())
    
    context.patient_record=json.loads(create_patient_result.text)['data']['createPatient']['patient'] # save entire record for future use
    PATIENT['id']=json.loads(create_patient_result.text)['data']['createPatient']['patient']['id']
    PATIENT['onPathwayId']=json.loads(create_patient_result.text)['data']['createPatient']['patient']['onPathways'][0]['id']

@then("we get the patient's record")
def step_impl(context):
    assert_that(context.patient_record['id'],not_none())
    assert_that(context.patient_record['firstName'], equal_to(PATIENT['firstName']))
    assert_that(context.patient_record['lastName'], equal_to(PATIENT['lastName']))
    assert_that(context.patient_record['hospitalNumber'], equal_to(PATIENT['hospitalNumber']))
    assert_that(context.patient_record['nationalNumber'], equal_to(PATIENT['nationalNumber']))
    assert_that(context.patient_record['dateOfBirth'], equal_to(PATIENT['dateOfBirth'].isoformat()))


##### SCENARIO: A PATIENT NEEDS A DECISION POINT ADDED #####
@when("we run the GraphQL mutation to add the decision point and milestones")
def step_impl(context):
    context.trust_adapter_mock.create_milestone.return_data=Milestone_IE(
        id=1,
        current_state=MilestoneState.INIT,
        added_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )

    async def load_many_milestones(recordIds, auth_token):
        data=[]
        for key in recordIds:
            data.append(
                Milestone_IE(
                    id=key,
                    current_state=MilestoneState.INIT,
                    added_at=datetime.now(),
                    updated_at=datetime.now()
                )
            )
        return data

    context.trust_adapter_mock.load_many_milestones=load_many_milestones

    context.trust_adapter_mock.load_milestone.return_value=Milestone_IE(
        id=1,
        current_state=MilestoneState.INIT,
        added_at=datetime.now(),
        updated_at=datetime.now()
    )
    

    create_decision_point_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        json={
            "query": """
                mutation createDecisionPoint(
                    $onPathwayId: ID!
                    $decisionType: DecisionType!
                    $clinicHistory: String!
                    $comorbidities: String!
                    $milestoneOneId: ID!
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
                                addedAt
                                updatedAt
                                currentState
                                
                                internalAddedAt
                                internalUpdatedAt
                                internalCurrentState

                                milestoneType{
                                    id
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
                "milestoneOneId":context.milestone_one.id,
            }
        }
    )

    assert_that(create_decision_point_result.status_code, equal_to(200))
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['id'], not_none()) # check that an id has been returned
    context.patient_record_from_decision_point=json.loads(create_decision_point_result.text)['data']['createDecisionPoint'] # save entire record for future use
    MILESTONE['milestoneId']=context.patient_record_from_decision_point['decisionPoint']['milestones'][0]['id']

@then("the milestones are completed")
def step_impl(context):


    async def updateMilestonesToCompleted():
        Milestone.update.values(current_state=MilestoneState.COMPLETED)\
            .where(Milestone.id==context.patient_record_from_decision_point['decisionPoint']['milestones'][0]['id'])\
            .gino.status()


    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        updateMilestonesToCompleted()
    )


    async def load_many_milestones(recordIds, auth_token):
        data=[]
        for key in recordIds:
            data.append(Milestone_IE(
                id=key,
                current_state=MilestoneState.COMPLETED,
                added_at=datetime.now(),
                updated_at=datetime.now()
            ))
        return data

    context.trust_adapter_mock.load_many_milestones=load_many_milestones

    context.trust_adapter_mock.load_milestone.return_value=Milestone_IE(
        id=1,
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now()
    )


##### SCENARIO: A PATIENT NEEDS A POST REQUEST DECISION POINT ADDED #####
@when("we run the GraphQL mutation to add a post request decision point")
def step_impl(context):
    create_decision_point_result=context.client.post(
        url=GRAPHQL_ENDPOINT,
        json={
            "query": """
                mutation createDecisionPoint(
                    $onPathwayId: ID!
                    $decisionType: DecisionType!
                    $clinicHistory: String!
                    $comorbidities: String!
                    $milestoneId: ID!
                ){
                    createDecisionPoint(input: {
                        onPathwayId: $onPathwayId,
                        decisionType: $decisionType,
                        clinicHistory: $clinicHistory,
                        comorbidities: $comorbidities,
                        milestoneRequests:[
                        ]
                        milestoneResolutions:[$milestoneId]
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
                                addedAt
                                updatedAt
                                currentState
                                
                                internalAddedAt
                                internalUpdatedAt
                                internalCurrentState

                                milestoneType{
                                    id
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
                "decisionType":DecisionTypes.POST_REQUEST.value,
                "clinicHistory":DECISION_POINT['clinicHistory'],
                "comorbidities":DECISION_POINT['comorbidities'],
                "milestoneId":MILESTONE['milestoneId']
            }
        }
    )

##### SCENARIO: WE SEARCH FOR A PATIENT #####
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
                        communicationMethod
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
                            underCareOf {
                                id
                                username
                            }
                            decisionPoints{
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
                                decisionType
                                addedAt
                                updatedAt
                                clinicHistory
                                comorbidities
                                milestones{
                                    id
                                    addedAt
                                    updatedAt
                                    currentState
                                    internalAddedAt
                                    internalUpdatedAt
                                    internalCurrentState
                                    milestoneType{
                                        id
                                        name
                                        refName
                                    }
                                    forwardDecisionPoint{
                                        id
                                    }
                                }
                                milestoneResolutions{
                                    id
                                    currentState
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
    logging.warning(json.loads(get_patient_result.text)['data']['getPatient'])

@then("we get the patient's record with all created data")
def step_impl(context):
    assert_that(context.get_patient_result, not_none())

    patient=context.get_patient_result

    assert_that(patient['id'], not_none())
    assert_that(patient['firstName'], equal_to(PATIENT['firstName']))
    assert_that(patient['lastName'], equal_to(PATIENT['lastName']))
    assert_that(patient['hospitalNumber'], equal_to(PATIENT['hospitalNumber']))
    assert_that(patient['nationalNumber'], equal_to(PATIENT['nationalNumber']))
    assert_that(patient['dateOfBirth'], equal_to(PATIENT['dateOfBirth'].isoformat()))
    assert_that(patient['communicationMethod'], equal_to(PATIENT['communicationMethod']))

    onPathway=patient['onPathways'][0]
    assert_that(onPathway, not_none())
    onPathway_Patient=onPathway['patient']

    assert_that(onPathway['isDischarged'], equal_to(False))
    assert_that(onPathway['awaitingDecisionType'], equal_to(DECISION_POINT['decisionType']))
    assert_that(onPathway['addedAt'], not_none())
    assert_that(onPathway['updatedAt'], not_none())
    assert_that(onPathway['referredAt'], not_none())
    assert_that(onPathway['underCareOf']['id'], equal_to(str(context.user.id)))
    assert_that(onPathway['underCareOf']['username'], equal_to(context.user.username))

    assert_that(onPathway_Patient['id'], not_none())
    assert_that(onPathway_Patient['firstName'], equal_to(PATIENT['firstName']))
    assert_that(onPathway_Patient['lastName'], equal_to(PATIENT['lastName']))
    assert_that(onPathway_Patient['hospitalNumber'], equal_to(PATIENT['hospitalNumber']))
    assert_that(onPathway_Patient['nationalNumber'], equal_to(PATIENT['nationalNumber']))
    assert_that(onPathway_Patient['dateOfBirth'], equal_to(PATIENT['dateOfBirth'].isoformat()))
    assert_that(onPathway_Patient['communicationMethod'], equal_to(PATIENT['communicationMethod']))

    onPathway_Pathway=onPathway['pathway']
    assert_that(onPathway_Pathway['id'], not_none())
    assert_that(onPathway_Pathway['name'], equal_to(PATHWAY['name']))



    onPathway_DecisionPoint_triage=onPathway['decisionPoints'][1]
    assert_that(onPathway_DecisionPoint_triage, not_none())

    assert_that(onPathway_DecisionPoint_triage['clinician'], not_none())
    assert_that(onPathway_DecisionPoint_triage['clinician']['id'], equal_to(str(context.user.id)))
    assert_that(onPathway_DecisionPoint_triage['clinician']['username'], equal_to(context.user.username))

    assert_that(onPathway_DecisionPoint_triage['onPathway'], not_none())
    assert_that(onPathway_DecisionPoint_triage['onPathway']['id'], not_none())
    assert_that(onPathway_DecisionPoint_triage['onPathway']['pathway']['id'], PATHWAY['id'])
    assert_that(onPathway_DecisionPoint_triage['onPathway']['pathway']['name'], PATHWAY['name'])

    assert_that(onPathway_DecisionPoint_triage['decisionType'], equal_to(DecisionTypes.TRIAGE.value))
    assert_that(onPathway_DecisionPoint_triage['clinicHistory'], equal_to(DECISION_POINT['clinicHistory']))
    assert_that(onPathway_DecisionPoint_triage['comorbidities'], equal_to(DECISION_POINT['comorbidities']))
    assert_that(onPathway_DecisionPoint_triage['addedAt'], not_none())
    assert_that(onPathway_DecisionPoint_triage['updatedAt'], not_none())
    
    milestone=onPathway_DecisionPoint_triage['milestones'][0]
    assert_that(milestone, not_none())
    assert_that(milestone['id'], not_none())
    assert_that(milestone['addedAt'], not_none())
    assert_that(milestone['updatedAt'], not_none())
    assert_that(milestone['internalAddedAt'], not_none())
    assert_that(milestone['internalUpdatedAt'], not_none())
    assert_that(milestone['currentState'], MilestoneState.COMPLETED)
    assert_that(milestone['milestoneType'], not_none())
    assert_that(milestone['milestoneType']['id'], not_none())
    assert_that(milestone['milestoneType']['name'], equal_to(context.milestone_one.name))
    assert_that(milestone['milestoneType']['refName'], equal_to(context.milestone_one.ref_name))
    assert_that(milestone['forwardDecisionPoint'], not_none())

    onPathway_DecisionPoint_postrequest=onPathway['decisionPoints'][0]
    assert_that(onPathway_DecisionPoint_postrequest, not_none())

    assert_that(onPathway_DecisionPoint_postrequest['clinician'], not_none())
    assert_that(onPathway_DecisionPoint_postrequest['clinician']['id'], equal_to(str(context.user.id)))
    assert_that(onPathway_DecisionPoint_postrequest['clinician']['username'], equal_to(context.user.username))

    assert_that(onPathway_DecisionPoint_postrequest['onPathway'], not_none())
    assert_that(onPathway_DecisionPoint_postrequest['onPathway']['id'], not_none())
    assert_that(onPathway_DecisionPoint_postrequest['onPathway']['pathway']['id'], PATHWAY['id'])
    assert_that(onPathway_DecisionPoint_postrequest['onPathway']['pathway']['name'], PATHWAY['name'])

    assert_that(onPathway_DecisionPoint_postrequest['decisionType'], equal_to(DecisionTypes.POST_REQUEST.value))
    assert_that(onPathway_DecisionPoint_postrequest['clinicHistory'], equal_to(DECISION_POINT['clinicHistory']))
    assert_that(onPathway_DecisionPoint_postrequest['comorbidities'], equal_to(DECISION_POINT['comorbidities']))
    assert_that(onPathway_DecisionPoint_postrequest['addedAt'], not_none())
    assert_that(onPathway_DecisionPoint_postrequest['updatedAt'], not_none())
