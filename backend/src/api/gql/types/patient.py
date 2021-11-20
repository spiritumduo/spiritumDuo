from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import PatientPathwayInstance, DecisionPoint, Patient

PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathways")
async def resolve_patient_pathways(obj=None, *_):
    allRelated = await database_sync_to_async(PatientPathwayInstance.objects.select_related)("patient")
    idRelated = await database_sync_to_async(list)(allRelated.filter(patient=obj.id))
    return idRelated

@PatientObjectType.field("decisionPoints")
async def resolve_patient_decision_points(obj=None, *_):
    allRelated = await database_sync_to_async(DecisionPoint.objects.select_related)("patient")
    idRelated = await database_sync_to_async(list)(allRelated.filter(patient=obj.id))
    return idRelated