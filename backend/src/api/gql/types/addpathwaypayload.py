from ariadne.objects import ObjectType

AddPathwayPayloadObjectType=ObjectType("AddPathwayPayload")

@AddPathwayPayloadObjectType.field("pathway")
async def resolve_pathway_payload_pathway(obj=None, *_):
    if "pathway" in obj:
        return obj['pathway']
    return None

@AddPathwayPayloadObjectType.field("userError")
async def resolve_pathway_payload_user_error(obj=None, *_):
    if "userError" in obj:
        return obj['userError']
    return None