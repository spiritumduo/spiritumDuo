from .mutation_type import mutation
from api.datacreation import CreateDecisionPoint

@mutation.field("createDecisionPoint")
async def resolve_create_decision_point(_=None, info=None, input=None):
    return await CreateDecisionPoint(
        patient=input["patient"],
        clinician=input["clinician"],
        pathway=input["pathway"],
        decision_type=input["decisionType"],
        clinic_history=input["clinicHistory"],
        comorbidities=input["comorbidities"],
        requests_referrals=input["requestsReferrals"],
    )