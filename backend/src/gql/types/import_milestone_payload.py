from ariadne.objects import ObjectType
from models import Milestone
from common import DataCreatorInputErrors
from typing import Union

ImportMilestonePayloadObjectType=ObjectType("ImportMilestonePayload")
@ImportMilestonePayloadObjectType.field("milestone")
async def resolve(obj:Union[Milestone, DataCreatorInputErrors]=None, *_):
    if type(obj) == Milestone: return obj
    return None

@ImportMilestonePayloadObjectType.field("userErrors")
async def resolve(obj:Union[Milestone, DataCreatorInputErrors]=None, *_):
    if type(obj) == DataCreatorInputErrors: return obj.errorList
    return None
