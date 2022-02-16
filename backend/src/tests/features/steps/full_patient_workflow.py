from behave import *
from hamcrest import *
import json
from SdTypes import MilestoneState, DecisionTypes
from datetime import datetime
from random import randint
from trustadapter.trustadapter import Patient_IE, TestResult_IE
import logging

CREATE_USER_REST_ENDPOINT="http://localhost:8080/rest/createuser/"
LOGIN_REST_ENDPOINT="http://localhost:8080/rest/login/"
GRAPHQL_ENDPOINT="graphql"
PATIENT={
    "id": 1,
    "firstName": "JOHN",
    "lastName": "DOE",
    "dateOfBirth": datetime(year=2000, month=1, day=1).date(),
    "hospitalNumber": f"fMRN{randint(100000,999999)}",
    "nationalNumber": f"fNHS{randint(100000000,999999999)}",
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

    context.trust_adapter_mock.create_test_result.return_value=TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_referral_letter.ref_name,
        id=1000
    )
    context.trust_adapter_mock.load_test_result.return_value=TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_referral_letter.ref_name,
        id=1000
    )
    context.trust_adapter_mock.load_many_test_results.return_value=[TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_referral_letter.ref_name,
        id=1000
    )]

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
                    $milestoneTypeId: ID!
                ){
                    createPatient(input: {
                        firstName: $firstName,
                        lastName: $lastName,
                        hospitalNumber: $hospitalNumber,
                        nationalNumber: $nationalNumber,
                        dateOfBirth: $dateOfBirth,
                        pathwayId: $pathwayId,
                        milestones: [
                            {
                                milestoneTypeId: $milestoneTypeId,
                                currentState: COMPLETED
                            }
                        ]
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
                                milestones{
                                    testResult{
                                        id
                                        description
                                        currentState
                                        addedAt
                                        updatedAt
                                        typeReferenceName
                                    }
                                }
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
                "pathwayId": PATHWAY['id'],
                "milestoneTypeId": context.milestone_referral_letter.id
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
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['id'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['description'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['currentState'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['addedAt'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['updatedAt'], not_none())
    assert_that(context.patient_record['onPathways'][0]['milestones'][0]['testResult']['typeReferenceName'], context.milestone_referral_letter.ref_name)
    



# ##### SCENARIO: A PATIENT NEEDS A DECISION POINT ADDED #####
@when("we run the GraphQL mutation to add the decision point and milestones")
def step_impl(context):
    context.trust_adapter_mock.create_test_result.return_value=TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_one.ref_name,
        id=2000
    )
    context.trust_adapter_mock.load_test_result.return_value=TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_one.ref_name,
        id=2000
    )
    context.trust_adapter_mock.load_many_test_results.return_value=[TestResult_IE(
        current_state=MilestoneState.COMPLETED,
        added_at=datetime.now(),
        updated_at=datetime.now(),
        description="This is a test description!",
        type_reference_name=context.milestone_one.ref_name,
        id=2000
    )]
    
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
                    $milestoneResolutionId: ID!
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
                        milestoneResolutions:[
                            $milestoneResolutionId
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
                "milestoneResolutionId": context.milestone_referral_letter.id
            }
        }
    )

    assert_that(create_decision_point_result.status_code, equal_to(200))
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['id'], not_none()) # check that an id has been returned
    
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['clinician'], not_none())
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['clinician']['id'], context.user.id)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['clinician']['username'], context.user.username)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['onPathway']['id'], PATIENT['onPathwayId'])
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['onPathway']['pathway']['id'], PATHWAY['id'])
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['onPathway']['pathway']['name'], PATHWAY['name'])
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['id'], not_none())
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['addedAt'], not_none())
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['updatedAt'], not_none())
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['currentState'], MilestoneState.INIT.value)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['milestoneType']['id'], context.milestone_one.id)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['milestones'][0]['milestoneType']['name'], context.milestone_one.name)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['decisionType'], DecisionTypes.TRIAGE.value)
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['clinicHistory'], DECISION_POINT['clinicHistory'])
    assert_that(json.loads(create_decision_point_result.text)['data']['createDecisionPoint']['decisionPoint']['comorbidities'], DECISION_POINT['comorbidities'])
    
    context.patient_record_from_decision_point=json.loads(create_decision_point_result.text)['data']['createDecisionPoint'] # save entire record for future use
    MILESTONE['milestoneId']=context.patient_record_from_decision_point['decisionPoint']['milestones'][0]['id']
    DECISION_POINT['id']=context.patient_record_from_decision_point['decisionPoint']['id']

@then("the milestones are completed")
def step_impl(context):
    res=context.client.post(
        url="rest/testresult/update",
        json={
            "id":2000,
            "new_state": MilestoneState.COMPLETED.value
        }
    )
    assert_that(res.status_code, equal_to(200))



##### SCENARIO: WE SEARCH FOR A PATIENT #####
@when("we run the query to search for the patient")
def step_impl(context):
    async def _load_many_test_results(recordIds=None, auth_token=None):
        recordIds = [int(x) for x in recordIds]
        retVal=[]
        if 1000 in recordIds:
            retVal.append(TestResult_IE(
                current_state=MilestoneState.COMPLETED,
                added_at=datetime.now(),
                updated_at=datetime.now(),
                description="This is a test description!",
                type_reference_name=context.milestone_referral_letter.ref_name,
                id=1000
            ))
        elif 2000 in recordIds:
            retVal.append(TestResult_IE(
                current_state=MilestoneState.COMPLETED,
                added_at=datetime.now(),
                updated_at=datetime.now(),
                description="This is a test description!",
                type_reference_name=context.milestone_one.ref_name,
                id=2000
            ))
        return retVal

    context.trust_adapter_mock.load_many_test_results=_load_many_test_results

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
                                dateOfBirth
                                communicationMethod
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
                                firstName
                                lastName
                            }
                            milestones{
                                id
                                addedAt
                                updatedAt
                                currentState
                                milestoneType{
                                    id
                                    name
                                    refName
                                }
                                forwardDecisionPoint{
                                    id
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
                            decisionPoints{
                                id
                                clinician{
                                    id
                                    username
                                    firstName
                                    lastName
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
                                    milestoneType{
                                        id
                                        name
                                        refName
                                    }
                                    forwardDecisionPoint{
                                        id
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
                                milestoneResolutions{
                                    id
                                    currentState
                                    addedAt
                                    updatedAt
                                    milestoneType{
                                        id
                                        name
                                        refName
                                    }
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

    onPathway_Milestone=onPathway['milestones'][0]
    assert_that(onPathway_Milestone['id'], not_none())
    assert_that(onPathway_Milestone, not_none())
    assert_that(onPathway_Milestone['id'], not_none())
    assert_that(onPathway_Milestone['addedAt'], not_none())
    assert_that(onPathway_Milestone['updatedAt'], not_none())
    assert_that(onPathway_Milestone['currentState'], MilestoneState.COMPLETED)
    assert_that(onPathway_Milestone['milestoneType'], not_none())
    assert_that(onPathway_Milestone['milestoneType']['id'], not_none())
    assert_that(onPathway_Milestone['milestoneType']['name'], equal_to(context.milestone_referral_letter.name))
    assert_that(onPathway_Milestone['milestoneType']['refName'], equal_to(context.milestone_referral_letter.ref_name))
    assert_that(onPathway_Milestone['forwardDecisionPoint'], DECISION_POINT['id'])

    onPathway_Milestone_TestResult=onPathway_Milestone['testResult']
    assert_that(onPathway_Milestone_TestResult, not_none())
    assert_that(onPathway_Milestone_TestResult['id'], not_none())
    assert_that(onPathway_Milestone_TestResult['description'], "This is a test description!")
    assert_that(onPathway_Milestone_TestResult['currentState'], MilestoneState.COMPLETED)
    assert_that(onPathway_Milestone_TestResult['addedAt'], not_none())
    assert_that(onPathway_Milestone_TestResult['updatedAt'], not_none())
    assert_that(onPathway_Milestone_TestResult['typeReferenceName'], context.milestone_referral_letter.ref_name)

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

    onPathway_DecisionPoint=onPathway['decisionPoints'][0]
    assert_that(onPathway_DecisionPoint, not_none())
    assert_that(onPathway_DecisionPoint['clinician'], not_none())
    assert_that(onPathway_DecisionPoint['clinician']['id'], equal_to(str(context.user.id)))
    assert_that(onPathway_DecisionPoint['clinician']['username'], equal_to(context.user.username))
    assert_that(onPathway_DecisionPoint['onPathway'], not_none())
    assert_that(onPathway_DecisionPoint['onPathway']['id'], not_none())
    assert_that(onPathway_DecisionPoint['onPathway']['pathway']['id'], PATHWAY['id'])
    assert_that(onPathway_DecisionPoint['onPathway']['pathway']['name'], PATHWAY['name'])
    assert_that(onPathway_DecisionPoint['decisionType'], equal_to(DecisionTypes.TRIAGE.value))
    assert_that(onPathway_DecisionPoint['clinicHistory'], equal_to(DECISION_POINT['clinicHistory']))
    assert_that(onPathway_DecisionPoint['comorbidities'], equal_to(DECISION_POINT['comorbidities']))
    assert_that(onPathway_DecisionPoint['addedAt'], not_none())
    assert_that(onPathway_DecisionPoint['updatedAt'], not_none())
    
    milestone=onPathway_DecisionPoint['milestones'][0]
    assert_that(milestone, not_none())
    assert_that(milestone['id'], not_none())
    assert_that(milestone['addedAt'], not_none())
    assert_that(milestone['updatedAt'], not_none())
    assert_that(milestone['currentState'], MilestoneState.COMPLETED)
    assert_that(milestone['milestoneType'], not_none())
    assert_that(milestone['milestoneType']['id'], not_none())
    assert_that(milestone['milestoneType']['name'], equal_to(context.milestone_one.name))
    assert_that(milestone['milestoneType']['refName'], equal_to(context.milestone_one.ref_name))
    assert_that(milestone['forwardDecisionPoint'], none())
    
    onPathway_DecisionPoint_TestResult=milestone['testResult']
    assert_that(onPathway_DecisionPoint_TestResult, not_none())
    assert_that(onPathway_DecisionPoint_TestResult['id'], not_none())
    assert_that(onPathway_DecisionPoint_TestResult['description'], "This is a test description!")
    assert_that(onPathway_DecisionPoint_TestResult['currentState'], MilestoneState.COMPLETED)
    assert_that(onPathway_DecisionPoint_TestResult['addedAt'], not_none())
    assert_that(onPathway_DecisionPoint_TestResult['updatedAt'], not_none())
    assert_that(onPathway_DecisionPoint_TestResult['typeReferenceName'], context.milestone_referral_letter.ref_name)