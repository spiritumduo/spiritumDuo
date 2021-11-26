from api.common import db_sync_to_async
from api.models import DecisionPoint

from api.models import SdUser, Pathway, Patient

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
    try:
        patient=Patient.objects.get(id=patient)
        clinician=SdUser.objects.get(id=clinician)
        pathway=Pathway.objects.get(id=pathway)
        dp=DecisionPoint(
            patient=patient,
            clinician=clinician,
            pathway=pathway,
            decision_type=decision_type,
            clinic_history=clinic_history,
            comorbidities=comorbidities,
            requests_referrals=requests_referrals
        )
        dp.save()
        return dp
    except Exception as e:
        print(e)
        return False