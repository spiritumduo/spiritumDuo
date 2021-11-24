from .query_type import query
from channels.db import database_sync_to_async
from api.models import PatientPathwayInstance
from api.dataloaders import PatientLoader

@query.field("getPatientsOnPathway")
async def resolve_get_patients_on_pathway(obj=None, info=None, id=None, filter=None, discharged=False):
    if not id:
        return None
    if filter and discharged:
        ptPwInstances=await database_sync_to_async(list)(PatientPathwayInstance.objects.filter(pathway=id, awaiting_decision_type=filter, is_discharged=discharged))
    elif filter is not None:
        ptPwInstances=await database_sync_to_async(list)(PatientPathwayInstance.objects.filter(pathway=id, awaiting_decision_type=filter))
    elif discharged is not None:
        ptPwInstances=await database_sync_to_async(list)(PatientPathwayInstance.objects.filter(pathway=id, is_discharged=discharged))
    ptList=[]
    for instance in ptPwInstances:
        patient=await PatientLoader.load_from_id(info.context, instance.patient_id)
        ptList.append(patient)
    return ptList