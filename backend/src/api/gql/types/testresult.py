from ariadne.objects import ObjectType
from channels.db import database_sync_to_async
from api.models import PatientPathwayInstance, TestResult

TestResultObjectType=ObjectType("TestResult")

@TestResultObjectType.field("pathwayInstance")
async def resolve_instance_pathway_instance(obj=None, *_, filter=None):
    idRelated = await database_sync_to_async(PatientPathwayInstance.objects.get)(id=obj.pathway_instance_id)
    return idRelated

## WARNING
## It is abolutely necessary this gets resolved fully
## and properly avoiding the use of string operations.
## We can probably store it as a JSON array or something
## Joe

@TestResultObjectType.field("mediaUrls")
async def resolve_test_result_media_urls(obj=None, *_):
    if not obj.media_urls:
        return None

    return obj.media_urls.strip('[]').split(", ") 