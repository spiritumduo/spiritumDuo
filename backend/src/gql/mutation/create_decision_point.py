from .mutation_type import mutation
from datacreators import CreateDecisionPoint
from authentication.authentication import needsAuthorization

@mutation.field("createDecisionPoint")
@needsAuthorization(["authenticated"])
async def resolve_create_decision(_=None, info=None, input:dict=None):
    return await CreateDecisionPoint(
        context=info.context,
        clinician_id=info.context['request']['user'].id,
        on_pathway_id=input['onPathwayId'],
        decision_type=input['decisionType'],
        clinic_history=input['clinicHistory'],
        comorbidities=input['comorbidities'],
        # milestones=input['']
    )