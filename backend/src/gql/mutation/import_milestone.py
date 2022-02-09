from .mutation_type import mutation
from datacreators import ImportMilestone
from authentication.authentication import needsAuthorization

@mutation.field("importMilestone")
@needsAuthorization(["authenticated"])
async def resolver(_=None, info=None, input:dict=None):
    data={
        "onPathwayId":input["onPathwayId"],
        "milestoneTypeId":input["milestoneTypeId"],
        "description":input["description"],
        "currentState":input["currentState"],
    }
    
    return {
        "milestone": await ImportMilestone(
            context=info.context,
            **data
        )
    }