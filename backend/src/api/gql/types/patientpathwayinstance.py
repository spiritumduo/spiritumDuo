from ariadne.objects import ObjectType
from api.common import db_sync_to_async
from api.models import PatientPathwayInstance

PatientPathwayInstanceObjectType=ObjectType("PatientPathwayInstance")

@PatientPathwayInstanceObjectType.field("pathway")
async def resolve_instance_pathway(obj=None, *_, filter=None):
    allRelated = await db_sync_to_async(PatientPathwayInstance.objects.select_related)("pathway")
    idRelated = await db_sync_to_async(allRelated.get)(id=obj.id)
    return idRelated.pathway