from dependency_injector.wiring import Provide, inject

from containers import SDContainer
from models import Patient, OnPathway, Milestone
from datetime import date, datetime
from gettext import gettext as _
import re
from dataloaders import PatientByHospitalNumberLoader, PathwayByIdLoader, PatientByHospitalNumberFromIELoader
from config import config as SdConfig
from typing import Optional, List
from trustadapter.trustadapter import Patient_IE, TrustAdapter, TestResultRequest_IE


class ReferencedItemDoesNotExistError(Exception):
    """
    This occurs when a referenced item does not 
    exist and cannot be found when it should
    """
class PatientNotInIntegrationEngineError(Exception):
    """
    This is raised when a patient cannot be found
    via the integration engine
    """
from typing import Optional, List, Union

@inject
async def CreatePatient(
    context:dict=None,
    first_name:str=None,
    last_name:str=None,
    hospital_number:str=None,
    national_number:str=None,
    date_of_birth:date=None,
    communication_method: Optional[str] = "LETTER",
    pathwayId:int=None,

    referred_at:datetime=None,
    awaiting_decision_type:Optional[str]="TRIAGE",
    milestones:List[Milestone]=None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    _db=context['db']
    userErrors=[]

    auth_token = context['request'].cookies['SDSESSION']
    
    # check if hospital number provided matches regex in configuration
    if re.search(SdConfig["HOSPITAL_NUMBER_REGEX"], hospital_number) is None: 
        userErrors.append({
            "message":_("Regex failure"),
            "field":"hospital_number"
        })
        
    if re.search(SdConfig["NATIONAL_NUMBER_REGEX"], national_number) is None:
        userErrors.append({
            "message":_("Regex failure"),
            "field":"national_number"
        })

    if len(userErrors)>0:
        return {
            "userErrors": userErrors 
        }

    if not pathwayId:
        raise ReferencedItemDoesNotExistError("Pathway ID not provided. Could not add new patient.")
    _pathway=await PathwayByIdLoader.load_from_id(context=context, id=pathwayId)
    if not _pathway:
        raise ReferencedItemDoesNotExistError("Pathway provided does not exist. Could not add new patient.")
    
    _patient:Patient_IE = await trust_adapter.load_patient(hospitalNumber=hospital_number, auth_token=auth_token)
    if _patient:
        if _patient.first_name!=first_name:
            userErrors.append({
                "message":_("Entry does not match patient from hospital number. Please check the information provided is correct"),
                "field":"first_name"
            })
        if _patient.last_name!=last_name:
            userErrors.append({
                "message":_("Entry does not match patient from hospital number. Please check the information provided is correct"),
                "field":"last_name"
            })
        if _patient.date_of_birth!=date_of_birth:
            userErrors.append({
                "message":_("Entry does not match patient from hospital number. Please check the information provided is correct"),
                "field":"date_of_birth"
            })
        if _patient.national_number!=national_number:
            userErrors.append({
                "message":_("Entry does not match patient from hospital number. Please check the information provided is correct"),
                "field":"national_number"
            })
        if len(userErrors)>0:
            return {
                "patient": None,
                "userErrors": userErrors 
            }

        # if the patient does already exist
        existingOnPathwayQuery=OnPathway.query.where(OnPathway.patient_id==_patient.id).where(OnPathway.pathway_id==_pathway.id).where(OnPathway.is_discharged==False)
        
        async with _db.acquire(reuse=False) as conn:
            existingOnPathway:Union[OnPathway, None]=await conn.one_or_none(existingOnPathwayQuery)
        
        if existingOnPathway: # if there is an active pathway instance
            return {"userErrors":[
                {
                    "message":_("Patient is already enrolled on specified pathway (not discharged)"),
                    "field":"pathway"
                }
            ]}
    else:
        _patient = Patient_IE(
            first_name=first_name,
            last_name=last_name,
            communication_method=communication_method,
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth
        )

        _patient:Patient_IE = await trust_adapter.create_patient(patient=_patient, auth_token=auth_token)
        if _patient is None:
            raise PatientNotInIntegrationEngineError(hospital_number, national_number)
        

    patient:Patient = await Patient.create(
        hospital_number=_patient.hospital_number,
        national_number=_patient.national_number
    )
    _patient.id = patient.id

    onPathwayInformation={
        'patient_id': _patient.id,
        'pathway_id': _pathway.id,
        'awaiting_decision_type': awaiting_decision_type,
        'is_discharged': False,
    }
    if referred_at:
        onPathwayInformation['referred_at']=referred_at
        
    _pathwayInstance:OnPathway=await OnPathway.create(
        **onPathwayInformation
    )

    for milestone in milestones:
        test_result:TestResult_IE=await trust_adapter.create_test_result(TestResultRequest_IE(
            type_id=milestone["milestoneTypeId"],
            current_state=milestone["currentState"],
        ), auth_token=auth_token)
        await Milestone.create(
            on_pathway_id=int(_pathwayInstance.id),
            current_state=milestone["currentState"],
            milestone_type_id=int(milestone["milestoneTypeId"]),
            test_result_reference_id=str(test_result.id)
        )

    return{
        "patient":_patient
    }