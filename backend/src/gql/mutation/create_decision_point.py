from .mutation_type import mutation
from datacreators import CreateDecisionPoint
from models import DecisionPoint, Milestone
from authentication.authentication import needsAuthorization
from trustadapter import GetTrustAdapter, TrustAdapter

@mutation.field("createDecisionPoint")
@needsAuthorization(["authenticated"])
async def resolve_create_decision(_=None, info=None, input:dict=None):
    decision_point:DecisionPoint=(await CreateDecisionPoint(
        context=info.context,
        clinician_id=info.context['request']['user'].id,
        on_pathway_id=input['onPathwayId'],
        decision_type=input['decisionType'],
        clinic_history=input['clinicHistory'],
        comorbidities=input['comorbidities'],
    ))
    if "userErrors" in decision_point:
        return decision_point
    _decision_point=decision_point['decisionPoint']


    integration_engine:TrustAdapter=GetTrustAdapter()()
    integration_engine.authToken=info.context['request'].cookies['SDSESSION']
    if 'milestoneRequests' in input.keys():
        for milestone_entry in input['milestoneRequests']:
            if "currentState" in milestone_entry:
                tie_milestone=await integration_engine.create_milestone(milestone=Milestone(
                    decision_point_id=int(_decision_point.id),
                    milestone_type_id=milestone_entry['milestoneTypeId'],
                    current_state=milestone_entry['currentState'].value
                ))
                await Milestone.create(
                    decision_point_id=int(_decision_point.id),
                    reference_id=int(tie_milestone['id']),
                    milestone_type_id=int(milestone_entry['milestoneTypeId']),
                    current_state=milestone_entry['currentState'].value
                )
            else:
                tie_milestone=await integration_engine.create_milestone(milestone=Milestone(
                    decision_point_id=_decision_point.id,
                    milestone_type_id=milestone_entry['milestoneTypeId']
                ))
                await Milestone.create(
                    decision_point_id=int(_decision_point.id),
                    reference_id=int(tie_milestone['id']),
                    milestone_type_id=int(milestone_entry['milestoneTypeId']),
                )
            
    return {
        "decisionPoint":_decision_point
    }