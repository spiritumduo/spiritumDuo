from ariadne.objects import ObjectType
from models import OnMdt
from common import DataCreatorInputErrors
from typing import Union

OnMdtPayloadObjectType = ObjectType("OnMdtPayload")


@OnMdtPayloadObjectType.field("onMdt")
async def resolve_on_mdt(
    obj: Union[OnMdt, DataCreatorInputErrors] = None, *_
):
    if type(obj) == OnMdt:
        return obj
    return None


@OnMdtPayloadObjectType.field("userErrors")
async def resolve_user_errors(
    obj: Union[OnMdt, DataCreatorInputErrors] = None, *_
):
    if type(obj) == DataCreatorInputErrors:
        return obj.errorList
    return None
