from .mutation_type import mutation
from datacreators import ImportMilestone
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo

@mutation.field("importMilestone")
@needsAuthorization(["authenticated"])
async def resolver(obj=None, info:GraphQLResolveInfo=None, input:dict=None):   
    milestone = await ImportMilestone(
        context = info.context,
        on_pathway_id = input["onPathwayId"],
        milestone_type_id = input["milestoneTypeId"],
        description = input["description"],
        current_state = input["currentState"],
    )
    return milestone