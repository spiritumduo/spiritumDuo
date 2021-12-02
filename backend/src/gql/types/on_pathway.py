from ariadne.objects import ObjectType
from dataloaders import PatientByIdLoader, PathwayLoader

OnPathwayObjectType=ObjectType("OnPathway")

@OnPathwayObjectType.field("pathway")
async def resolve_on_pathway_pathway(obj=None, info=None, *_):
    return await PathwayLoader.load_from_id(context=info.context, id=obj.pathway)

@OnPathwayObjectType.field("patient")
async def resolve_on_pathway_patient(obj=None, info=None, *_):
    return await PatientByIdLoader.load_from_id(context=info.context, id=obj.patient)