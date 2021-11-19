from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import PatientPathwayInstance

PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathwayInstance")
async def resolve_patient_pathway_instances(obj=None, *_):
    if not obj:
        return None
    pathwayInstance=await database_sync_to_async(PatientPathwayInstance.objects.select_related)("patient")
    patientPathwayInstance=await pathwayInstance.filter(patient=obj.id)
    print(patientPathwayInstance)
    return patientPathwayInstance