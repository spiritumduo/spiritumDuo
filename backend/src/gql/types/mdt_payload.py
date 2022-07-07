from ariadne.objects import ObjectType
from models import MDT
from common import DataCreatorInputErrors
from typing import Union

MdtPayloadObjectType = ObjectType("MdtPayload")


@MdtPayloadObjectType.field("mdt")
async def resolve_pathway(
    obj: Union[MDT, DataCreatorInputErrors] = None, *_
):
    if type(obj) == MDT:
        return obj
    return None


@MdtPayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: Union[MDT, DataCreatorInputErrors] = None, *_
):
    if type(obj) == DataCreatorInputErrors:
        return obj.errorList
    return None
