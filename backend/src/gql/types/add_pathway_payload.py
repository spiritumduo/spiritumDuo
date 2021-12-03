from ariadne.objects import ObjectType

AddPathwayPayloadObjectType=ObjectType("AddPathwayPayload")

@AddPathwayPayloadObjectType.field("pathway")
async def resolve_pathway_payload_patient(obj=None, *_):
    if "pathway" in obj:
        return obj['pathway']
    return None

@AddPathwayPayloadObjectType.field("userErrors")
async def resolve_pathway_payload_user_error(obj=None, *_):
    if "userErrors" in obj:
        return obj['userErrors']
    return None