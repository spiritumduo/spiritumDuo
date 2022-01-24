from .query_type import query
from dataloaders import MilestoneTypeLoader
from authentication.authentication import needsAuthorization


@query.field("getMilestoneTypes")
@needsAuthorization(["authenticated"])
async def resolve_get_milestone_types(obj=None, info=None):
    return await MilestoneTypeLoader.load_all(info.context)
