from .mutation_type import mutation
from datacreators import ImportMilestone
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo

@mutation.field("importMilestone")
@needsAuthorization(["authenticated"])
async def resolver(obj=None, info:GraphQLResolveInfo=None, input:dict=None):   
    milestone = await ImportMilestone(
        context = info.context,
        onPathwayId = input["onPathwayId"],
        milestoneTypeId = input["milestoneTypeId"],
        description = input["description"],
        currentState = input["currentState"],
    )
    return milestone