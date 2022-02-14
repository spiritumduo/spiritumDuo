from .mutation_type import mutation
from datacreators import ImportMilestone
from authentication.authentication import needsAuthorization

@mutation.field("importMilestone")
@needsAuthorization(["authenticated"])
    data={
        "onPathwayId":input["onPathwayId"],
        "milestoneTypeId":input["milestoneTypeId"],
        "description":input["description"],
        "currentState":input["currentState"],
    }
    
async def resolver(obj=None, info:GraphQLResolveInfo=None, input:dict=None):   
    return {
        "milestone": await ImportMilestone(
            context=info.context,
            **data
        )
    }