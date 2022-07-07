from ariadne.objects import ObjectType
from common import DataCreatorInputErrors
from typing import Union

DeletePayloadObjectType = ObjectType("DeletePayload")


@DeletePayloadObjectType.field("success")
async def resolve_patient(
    obj: Union[bool, DataCreatorInputErrors] = None, *_
):
    if type(obj) == bool:
        return obj
    return None


@DeletePayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: Union[bool, DataCreatorInputErrors] = None, *_
):
    if type(obj) == DataCreatorInputErrors:
        return obj.errorList
    return None
