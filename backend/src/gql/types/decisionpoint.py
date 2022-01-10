from ariadne.objects import ObjectType
from dataloaders import UserByIdLoader, PatientByIdLoader, OnPathwayByIdLoader

DecisionPointObjectType=ObjectType("DecisionPoint")

@DecisionPointObjectType.field("clinician")
async def resolve_on_pathway_clinician(obj=None, info=None, *_):
    return await UserByIdLoader.load_from_id(context=info.context, id=obj.user)

@DecisionPointObjectType.field("patient")
async def resolve_on_pathway_patient(obj=None, info=None, *_):
    return await PatientByIdLoader.load_from_id(context=info.context, id=obj.patient)

@DecisionPointObjectType.field("onPathway")
async def resolve_on_pathway_pathway(obj=None, info=None, *_):
    return await OnPathwayByIdLoader.load_from_id(context=info.context, id=obj.onPathway)
