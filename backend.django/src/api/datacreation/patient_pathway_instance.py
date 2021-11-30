from api.common import db_sync_to_async
from api.models import PatientPathwayInstance
from api.dataloaders import PatientLoader, PathwayLoader

# @db_sync_to_async
async def CreatePatientPathwayInstance(
    patient:int=None,
    pathway:int=None,
    is_discharged:bool=False,
    awaiting_decision_type:str="TRIAGE",
    context=None
):
    try:
        patientObj=await PatientLoader.load_from_id(context=context, ids=patient)
        pathwayObj=await PathwayLoader.load_from_id(context=context, ids=pathway)
        instance=PatientPathwayInstance(
            patient=patientObj,
            pathway=pathwayObj,
            is_discharged=is_discharged,
            awaiting_decision_type=awaiting_decision_type
        )

        await db_sync_to_async(instance.save)()
        return instance
    except Exception as e:
        print(e)
        return False