from ariadne.objects import ObjectType
from api.common import db_sync_to_async
from api.models import PatientPathwayInstance, TestResultMedia

TestResultObjectType=ObjectType("TestResult")

@TestResultObjectType.field("patientPathwayInstance")
async def resolve_instance_pathway_instance(obj=None, *_, filter=None):
    idRelated = await db_sync_to_async(PatientPathwayInstance.objects.get)(id=obj.patient_pathway_instance_id)
    return idRelated

@TestResultObjectType.field("mediaUrls")
async def resolve_test_result_media_urls(obj=None, *_):
    dataSet=await db_sync_to_async(list)(TestResultMedia.objects.filter(test_result_id=obj.id))
    mediaUrls=[]
    for item in dataSet:
        mediaUrls.append(item.resource_path)
    return mediaUrls