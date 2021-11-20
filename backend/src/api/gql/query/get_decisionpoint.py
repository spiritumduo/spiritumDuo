from .query_type import query
from api.dataloaders import DecisionPointLoader

@query.field("getDecisionPoint")
async def resolve_get_decision_point(obj=None, info=None, id=None):
    dp=await DecisionPointLoader.load_from_id(info.context, id)
    return dp or None