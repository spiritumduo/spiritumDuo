from ariadne.objects import ObjectType
from common import DataCreatorInputErrors
from typing import Union

DeletePayloadObjectType = ObjectType("DeletePayload")


@DeletePayloadObjectType.field("success")
async def resolve_patient(
    obj: bool = None, *_
):
    if type(obj) == bool:
        return obj
    return None


@DeletePayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: DataCreatorInputErrors = None, *_
):
    if type(obj) == DataCreatorInputErrors:
        return obj.errorList
    return None
