from .mutation_type import mutation
from api.datacreation import CreatePatientPathwayInstance

@mutation.field("createPatientPathwayInstance")
async def resolve_create_patient_pathway_instance(_=None, info=None, input=None):
    return await CreatePatientPathwayInstance(
        patient=input["patient"],
        pathway=input["pathway"],
        is_discharged=input["isDischarged"],
        awaiting_decision_type=input["awaitingDecisionType"],
        context=info.context
    )