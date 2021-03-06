from ariadne.objects import ObjectType
from models import Pathway
from common import DataCreatorInputErrors
from typing import Union

AddPathwayPayloadObjectType = ObjectType("AddPathwayPayload")


@AddPathwayPayloadObjectType.field("pathway")
async def resolve_pathway(
    obj: Union[Pathway, DataCreatorInputErrors] = None, *_
):
    if type(obj) == Pathway:
        return obj
    return None


@AddPathwayPayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: Union[Pathway, DataCreatorInputErrors] = None, *_
):
    if type(obj) == DataCreatorInputErrors:
        return obj.errorList
    return None
