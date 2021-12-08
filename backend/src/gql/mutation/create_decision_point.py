from .mutation_type import mutation
from datacreators import CreateDecisionPoint
from authentication.authentication import needsAuthorization

@mutation.field("createDecisionPoint")
@needsAuthorization(["authenticated"])
async def resolve_create_decision(_=None, info=None, input=None):
    return await CreateDecisionPoint(
        context=info.context,
        patient_id=input['patientId'],
        clinician_id=input['clinicianId'],
        pathway_id=input['pathwayId'],
        decision_type=input['decisionType'],
        clinic_history=input['clinicHistory'],
        comorbidities=input['comorbidities'],
        requests_referrals=input['requestsReferrals'],
    )