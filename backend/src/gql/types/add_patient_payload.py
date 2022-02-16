from ariadne.objects import ObjectType
from trustadapter.trustadapter import Patient_IE
from common import DataCreatorInputErrors
from typing import Union

AddPatientPayloadObjectType=ObjectType("AddPatientPayload")
@AddPatientPayloadObjectType.field("patient")
async def resolve(obj:Union[Patient_IE, DataCreatorInputErrors]=None, *_):
    if type(obj) == Patient_IE: return obj
    return None

@AddPatientPayloadObjectType.field("userErrors")
async def resolve(obj:Union[Patient_IE, DataCreatorInputErrors]=None, *_):
    if type(obj) == DataCreatorInputErrors: return obj.errorList
    return None
