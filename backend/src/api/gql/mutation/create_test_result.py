from .mutation_type import mutation
from api.datacreation import CreateTestResult
from api.dataloaders import PatientPathwayInstanceLoader, PatientLoader

@mutation.field("createTestResult")
async def resolve_create_test_result(_=None, info=None, input=None):
    patientPathwayInstance=await PatientPathwayInstanceLoader.load_from_id(info.context, input['patientPathwayInstance'])
    patient=await PatientLoader.load_from_id(info.context, input['patient'])
    return await CreateTestResult(
        patient=patient,
        patient_pathway_instance=patientPathwayInstance,
        description=input['description'],
        media_urls=input['mediaUrls']
    )