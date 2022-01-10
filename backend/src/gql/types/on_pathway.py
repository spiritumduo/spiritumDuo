from ariadne.objects import ObjectType
from dataloaders import PatientByIdLoader, PathwayByIdLoader, DecisionPointsByOnPathway

OnPathwayObjectType=ObjectType("OnPathway")

@OnPathwayObjectType.field("pathway")
async def resolve_on_pathway_pathway(obj=None, info=None, *_):
    return await PathwayByIdLoader.load_from_id(context=info.context, id=obj.pathway_id)

@OnPathwayObjectType.field("patient")
async def resolve_on_pathway_patient(obj=None, info=None, *_):
    return await PatientByIdLoader.load_from_id(context=info.context, id=obj.patient_id)

@OnPathwayObjectType.field("decisionPoints")
async def resolve(obj=None, info=None, *_):
    return await DecisionPointsByOnPathway.load_many_from_id(context=info.context, id=obj.id)