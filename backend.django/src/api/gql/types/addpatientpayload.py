from ariadne.objects import ObjectType

AddPatientPayloadObjectType=ObjectType("AddPatientPayload")

@AddPatientPayloadObjectType.field("patient")
async def resolve_patient_payload_patient(obj=None, *_):
    if "patient" in obj:
        return obj['patient']
    return None

@AddPatientPayloadObjectType.field("userErrors")
async def resolve_patient_payload_user_error(obj=None, *_):
    if "userErrors" in obj:
        return obj['userErrors']
    return None