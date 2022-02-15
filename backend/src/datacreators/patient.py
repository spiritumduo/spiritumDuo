import re
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from models import Patient, OnPathway, Milestone, Pathway
from datetime import date, datetime
from gettext import gettext as _
from dataloaders import PathwayByIdLoader
from config import config as SdConfig
from typing import Optional, List, Union
from trustadapter.trustadapter import Patient_IE, TestResult_IE, TrustAdapter, TestResultRequest_IE
from common import ReferencedItemDoesNotExistError, PatientNotInIntegrationEngineError, DataCreatorInputErrors

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
    milestones:List[Milestone]={},
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    _db=context['db']

    auth_token = context['request'].cookies['SDSESSION']
    
    errors=DataCreatorInputErrors()
    # check if hospital number provided matches regex in configuration
    if re.search(SdConfig["HOSPITAL_NUMBER_REGEX"], hospital_number) is None: 
        errors.addError(field="hospital_number", message="Input does not match expected pattern")
        
    if re.search(SdConfig["NATIONAL_NUMBER_REGEX"], national_number) is None:
        errors.addError(field="national_number", message="Input does not match expected pattern")
    
    if errors.hasErrors(): return errors

    if not pathwayId:
        raise ReferencedItemDoesNotExistError("Pathway ID not provided.")

    _pathway:Pathway=await PathwayByIdLoader.load_from_id(context=context, id=pathwayId)
    if _pathway is None:
        raise ReferencedItemDoesNotExistError("Pathway provided does not exist.")
    
    _patient:Patient_IE = await trust_adapter.load_patient(hospitalNumber=hospital_number, auth_token=auth_token)
    if _patient:
        if _patient.first_name!=first_name:
            errors.addError(field="first_name", message="Input does not match patient from external system")
        if _patient.last_name!=last_name:
            errors.addError(field="last_name", message="Input does not match patient from external system")
        if _patient.date_of_birth!=date_of_birth:
            errors.addError(field="date_of_birth", message="Input does not match patient from external system")
        if _patient.national_number!=national_number:
            errors.addError(field="national_number", message="Input does not match patient from external system")
        
        if errors.hasErrors(): return errors

        # if the patient does already exist
        existingOnPathwayQuery=OnPathway.query.where(OnPathway.patient_id==_patient.id).where(OnPathway.pathway_id==_pathway.id).where(OnPathway.is_discharged==False)
        
        async with _db.acquire(reuse=False) as conn:
            existingOnPathway:Union[OnPathway, None]=await conn.one_or_none(existingOnPathwayQuery)
        
        if existingOnPathway: # if there is an active pathway instance
            errors.addError(field="patient", message="Patient already belongs to this pathway and is not discharged")

        if errors.hasErrors(): return errors
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
    return _patient