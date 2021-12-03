from models import Patient, OnPathway
from datetime import date
from gettext import gettext as _
import re
from dataloaders import PatientByHospitalNumberLoader, PathwayByIdLoader
from config import config as SdConfig
from typing import Optional
class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item does not 
        exist and cannot be found when it should
    """

async def Create(
    context=None,
    first_name:str=None,
    last_name:str=None,
    hospital_number:str=None,
    national_number:str=None,
    date_of_birth:date=None,

    pathway:int=None,

    awaiting_decision_type:Optional[str]="TRIAGE",
    communication_method:Optional[str]="LETTER",
):


    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    userErrors=[]
    print("hosp no: ",hospital_number)
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

    if not pathway:
        raise ReferencedItemDoesNotExistError("Pathway ID not provided. Could not add new patient.")
    _pathway=await PathwayByIdLoader.load_from_id(context=context, id=pathway)
    if not _pathway:
        raise ReferencedItemDoesNotExistError("Pathway provided does not exist. Could not add new patient.")
    
    _patient=await PatientByHospitalNumberLoader.load_from_id(context=context, id=hospital_number)
    if _patient:
        print("Found patient")
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
                "userErrors": userErrors 
            }
    else:
        print("Creating new patient")
        _patient=await Patient.create(
            first_name=first_name,
            last_name=last_name,
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth,
            communication_method=communication_method
        )
    _pathwayInstance=await OnPathway.create(
        patient=_patient.id,
        pathway=_pathway.id,
        awaiting_decision_type=awaiting_decision_type,
        is_discharged=False
    )
    return{
        "patient":_patient
    }