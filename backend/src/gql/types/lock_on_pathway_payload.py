from ariadne.objects import ObjectType
from models import OnPathway
from common import DataCreatorInputErrors
from typing import Union

LockOnPathwayPayloadObjectType = ObjectType("LockOnPathwayPayload")


@LockOnPathwayPayloadObjectType.field("onPathway")
async def resolve_on_pathway(
    obj: Union[OnPathway, DataCreatorInputErrors] = None, *_
):
    return obj['onPathway']


@LockOnPathwayPayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: Union[OnPathway, DataCreatorInputErrors] = None, *_
):
    return obj['userErrors']
