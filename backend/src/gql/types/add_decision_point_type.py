from ariadne.objects import ObjectType

AddDecisionPointPayloadObjectType=ObjectType("AddDecisionPointPayload")

@AddDecisionPointPayloadObjectType.field("decisionPoint")
async def resolve_decision_point_payload_patient(obj=None, *_):
    if "decisionPoint" in obj:
        return obj['decisionPoint']
    return None

@AddDecisionPointPayloadObjectType.field("userErrors")
async def resolve_decision_point_payload_user_error(obj=None, *_):
    if "userErrors" in obj:
        return obj['userErrors']
    return None