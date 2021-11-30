from .mutation_type import mutation
from api.datacreation import CreateTestResult

@mutation.field("createTestResult")
async def resolve_create_test_result(_=None, info=None, input=None):
    return await CreateTestResult(
        patient=input['patient'],
        pathway=input['pathway'],
        description=input['description'],
        media_urls=input['mediaUrls']
    )