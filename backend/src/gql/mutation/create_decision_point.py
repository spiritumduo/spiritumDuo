from dependency_injector.wiring import Provide, inject

from containers import SDContainer
from .mutation_type import mutation
from datacreators import CreateDecisionPoint
from models import DecisionPoint, Milestone
from authentication.authentication import needsAuthorization
from trustadapter import TrustAdapter



@mutation.field("createDecisionPoint")
@needsAuthorization(["authenticated"])
@inject
async def resolve_create_decision(
        _=None, info=None, input: dict=None,
        trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    decision_point_details={
        "context": info.context,
        "clinician_id": info.context['request']['user'].id,
        "on_pathway_id": input['onPathwayId'],
        "decision_type": input['decisionType'],
        "clinic_history": input['clinicHistory'],
        "comorbidities": input['comorbidities'],
    }
    if "milestoneResolutions" in input:
        decision_point_details['milestone_resolutions']=input['milestoneResolutions']

    decision_point:DecisionPoint=(await CreateDecisionPoint(
        **decision_point_details
    ))
    if "userErrors" in decision_point:
        return decision_point
    _decision_point=decision_point['decisionPoint']

    auth_token = info.context['request'].cookies['SDSESSION']

    if 'milestoneRequests' in input.keys():
        for milestone_entry in input['milestoneRequests']:
            milestone = Milestone(
                decision_point_id=int(_decision_point.id),
                milestone_type_id=int(milestone_entry['milestoneTypeId']),
            )
            if "currentState" in milestone_entry:
                milestone.current_state = milestone_entry["currentState"].value
            tie_milestone = await trust_adapter.create_milestone(
                milestone=milestone,
                auth_token=auth_token
            )
            milestone.reference_id = tie_milestone.id
            await milestone.create()
            
    return {
        "decisionPoint":_decision_point
    }