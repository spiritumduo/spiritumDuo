from ariadne.objects import ObjectType

AddPatientPayloadObjectType=ObjectType("AddPatientPayload")

@AddPatientPayloadObjectType.field("patient")
async def resolve_patient_payload_patient(obj=None, *_):
    if "patient" in obj:
        return obj['patient']
    return None

@AddPatientPayloadObjectType.field("userError")
async def resolve_patient_payload_user_error(obj=None, *_):
    if "userError" in obj:
        return obj['userError']
    return None