from .mutation_type import mutation
from api.datacreation import CreateTestResult
from api.dataloaders import PatientPathwayInstanceLoader, PatientLoader

@mutation.field("createTestResult")
async def resolve_create_test_result(_=None, info=None, input=None):
    pathwayInstance=await PatientPathwayInstanceLoader.load_from_id(info.context, input['pathwayInstance'])
    patient=await PatientLoader.load_from_id(info.context, input['patient'])
    return await CreateTestResult(
        patient=patient,
        pathway_instance=pathwayInstance,
        description=input['description'],
        media_urls=input['mediaUrls']
    )