from asgiref.sync import sync_to_async
from api.models import DecisionPoint
from datetime import datetime

from api.models import SdUser, Pathway, Patient

@sync_to_async
def CreateDecisionPoint(
    patient:int=None,
    clinician:int=None,
    pathway:int=None,
    added_at:datetime=None,
    updated_at:datetime=None,
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
            added_at=added_at,
            updated_at=updated_at,
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