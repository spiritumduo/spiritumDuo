from api.common import db_sync_to_async
from api.models import Patient, Pathway, PatientPathwayInstance

from datetime import date
from django.utils.translation import gettext as _

import re
from backend.settings import SPIRITUM_DUO as SdConfig

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
    # check if hospital number provided matches REGEX in configuration
    if re.search(SdConfig["HOSPITAL_NUMBER_REGEX"], hospital_number) is None: 
        return{
            "userError":{{
                "message":_("Regex failure"),
                "field":"hospital_number"
            }}
        }
    if re.search(SdConfig["NATIONAL_NUMBER_REGEX"], national_number) is None:
        return{
            "userError":{{
                "message":_("Regex failure"),
                "field":"national_number"
            }}
        }

    patientObject=None # readability's sake
    try:
        """
        gets the patient via hospital number (cannot use ID as user not provided)
        could expand this to cover national number, but unsure based on how
        the number can change. need to investigate
        """
        patientObject=Patient.objects.get(hospital_number=hospital_number) 

    except Patient.DoesNotExist:
        pass


    """
    Not sure about how to handle errors here, it needs something but 
    I'm guessing the user would select the pathway by dropdown or something.
    We could replace this with an exception though
    """

    pathwayObject=None # readability's sake
    try:
        pathwayObject=Pathway.objects.get(id=pathway)
    except Pathway.DoesNotExist:
        return{
            "userError":{{
                "message":_("Pathway provided does not exist"),
                "field":"pathway"
            }}
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
        return{
            "userError":{
                "message":_("Patient is already enrolled on active pathway (not discharged)"),
                "field":"pathway"
            }
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