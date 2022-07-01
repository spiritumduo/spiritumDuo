from .mutation_type import mutation
from datacreators import CreateDecisionPoint
from models import DecisionPoint, OnPathway
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from SdTypes import Permissions


@mutation.field("createDecisionPoint")
@needsAuthorization([
    Permissions.DECISION_CREATE,
    Permissions.MILESTONE_CREATE,
    Permissions.ON_MDT_CREATE
])
@inject
async def resolve_create_decision(
    obj=None, info: GraphQLResolveInfo = None, input: dict = None,
    pub=Provide[SDContainer.pubsub_service]
) -> DecisionPoint:
    decision_point_details = {
        "context": info.context,
        "clinician_id": info.context['request']['user'].id,
        "on_pathway_id": input['onPathwayId'],
        "decision_type": input['decisionType'],
        "clinic_history": input['clinicHistory'],
        "comorbidities": input['comorbidities'],
    }
    if "milestoneResolutions" in input:
        decision_point_details['milestone_resolutions'] = \
            input['milestoneResolutions']
    if "milestoneRequests" in input:
        decision_point_details['milestone_requests'] = \
            input['milestoneRequests']
    if "mdt" in input:
        decision_point_details['mdt'] = input['mdt']

    on_pathway: OnPathway = await OnPathway.get(int(input['onPathwayId']))

    decision_point: DecisionPoint = await CreateDecisionPoint(
        **decision_point_details
    )

    await pub.publish(
        'on-pathway-updated',
        on_pathway
    )

    return decision_point
