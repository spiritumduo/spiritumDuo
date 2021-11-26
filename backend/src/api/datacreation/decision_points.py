from api.common import db_sync_to_async
from api.models import DecisionPoint

from api.models import SdUser, Pathway, Patient


class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item (patient, user, pathway)
        does not exist and cannot be found
    """

@db_sync_to_async
def CreateDecisionPoint(
    patient:int=None,
    clinician:int=None,
    pathway:int=None,
    decision_type:str=None,
    clinic_history:str=None,
    comorbidities:str=None,
    requests_referrals:str=None
):
    """
        Opted to run this through exceptions because if one of these values is incorrect,
        it indicated a failing on the side of the system because these should be 
        automatically populated
    """
    patientObject=None
    try:
        patientObject=Patient.objects.get(id=patient)
    except Patient.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: patient ("+str(patient)+")")

    clinicianObject=None
    try:
        clinicianObject=SdUser.objects.get(id=clinician)
    except SdUser.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: clinician ("+str(clinician)+")")

    pathwayObject=None
    try:
        pathwayObject=Pathway.objects.get(id=pathway)
    except Pathway.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: pathway ("+str(pathway)+")")

    try:
        dp=DecisionPoint(
            patient=patientObject,
            clinician=clinicianObject,
            pathway=pathwayObject,
            decision_type=decision_type,
            clinic_history=clinic_history,
            comorbidities=comorbidities,
            requests_referrals=requests_referrals
        )
        dp.save()
        return dp
    except Exception as e:
        raise e