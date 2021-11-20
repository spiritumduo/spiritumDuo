from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import DecisionPoint, SdUser

DecisionPointObjectType=ObjectType("DecisionPoint")

@DecisionPointObjectType.field("clinician")
async def resolve_decision_point_clinician(obj=None, *_):
    allRelated = await database_sync_to_async(DecisionPoint.objects.select_related)("clinician")
    idRelated = await database_sync_to_async(allRelated.get)(id=obj.id)
    return idRelated.clinician

@DecisionPointObjectType.field("pathway")
async def resolve_decision_point_pathway(obj=None, *_):
    allRelated = await database_sync_to_async(DecisionPoint.objects.select_related)("pathway")
    idRelated = await database_sync_to_async(allRelated.get)(id=obj.id)
    return idRelated.pathway