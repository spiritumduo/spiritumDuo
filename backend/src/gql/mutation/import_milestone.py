from containers import SDContainer
from models import Milestone, OnPathway
from .mutation_type import mutation
from datacreators import ImportMilestone
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from dependency_injector.wiring import Provide, inject


@mutation.field("importMilestone")
@needsAuthorization(["authenticated"])
@inject
async def resolver(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
    pub=Provide[SDContainer.pubsub_service]
) -> Milestone:
    milestone = await ImportMilestone(
        context=info.context,
        on_pathway_id=input["onPathwayId"],
        milestone_type_id=input["milestoneTypeId"],
        description=input["description"],
        current_state=input["currentState"],
    )
    await pub.publish(
        'on-pathway-updated',
        await OnPathway.get(milestone.on_pathway_id)
    )
    return milestone
