from api.common import db_sync_to_async
from api.models import Patient, Pathway, PatientPathwayInstance

from datetime import date
from django.utils.translation import gettext as _

import re
from backend.settings import SPIRITUM_DUO as SdConfig

class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item (pathway)
        does not exist and cannot be found when it should
    """

@db_sync_to_async
def CreatePatient(
    first_name:str=None,
    last_name:str=None,
    communication_method:str=None,
    hospital_number:int=None,
    national_number:int=None,
    date_of_birth:date=None,

    pathway:int=None,
    awaiting_decision_type:str="TRIAGE"
):
    userErrors=[]
    # check if hospital number provided matches REGEX in configuration
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

    patientObject=None
    ptByHospitalNum=None
    ptByNationalNum=None
    try:
        ptByHospitalNum=Patient.objects.get(hospital_number=hospital_number) 
    except Patient.DoesNotExist:
        pass

    try:
        ptByNationalNum=Patient.objects.get(national_number=national_number) 
    except Patient.DoesNotExist:
        pass

    if ptByHospitalNum == ptByNationalNum:
        patientObject = ptByHospitalNum
    else:
        return {
            "userErrors": [
                {
                    "message":_("Values provided do not return the same patient. Are the values correct?"),
                    "field":"hospital_number, national_number"
                }
            ] 
        }

    pathwayObject=None # readability's sake
    try:
        pathwayObject=Pathway.objects.get(id=pathway)
    except Pathway.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: pathway (id:"+str(pathway)+")")

    if len(userErrors)>0:
        return {
            "userErrors": userErrors 
        }

    if patientObject is None: # patient does not exist in database
        # create new patient record
        patientObject=Patient( 
            first_name=first_name,
            last_name=last_name,
            communication_method=communication_method,
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth,
        )
        patientObject.save()

        # create associated pathway instance
        pPI=PatientPathwayInstance(
            patient=patientObject,
            pathway=pathwayObject,
            awaiting_decision_type=awaiting_decision_type,
            is_discharged=False
        )   
        pPI.save()

        # we don't need to send the pathway instance too as it can be derived
        # from the patient type
        return {
            "patient": patientObject
        }
    
    # if the patient does already exist
    existingPPIs=PatientPathwayInstance.objects.filter(patient=patientObject, pathway=pathwayObject, is_discharged=False) # get any active pathway instances
    if len(existingPPIs)>0: # if there is an active pathway instance
        return {
            "userErrors": [
                {
                    "message":_("Patient is already enrolled on specified pathway (not discharged)"),
                    "field":"pathway"
                }
            ]
        }

    # there isn't an active instance, so let's make a new one
    pPI=PatientPathwayInstance(
        patient=patientObject,
        pathway=pathwayObject,
        awaiting_decision_type=awaiting_decision_type,
        is_discharged=False
    )
    pPI.save()

    return {
        "patient": patientObject
    }