from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import PatientPathwayInstance

TestResultObjectType=ObjectType("TestResult")

@TestResultObjectType.field("pathwayInstance")
async def resolve_instance_pathway_instance(obj=None, *_, filter=None):
    idRelated = await database_sync_to_async(PatientPathwayInstance.objects.get)(id=obj.pathway_instance_id)
    return idRelated

@TestResultObjectType.field("mediaUrls")
async def resolve_test_result_media_urls(obj=None, *_):
    return ["test1", "test2"]