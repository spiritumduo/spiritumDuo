from ariadne.objects import ObjectType
from dataloaders import PatientByIdLoader, PathwayByIdLoader, DecisionPointsByOnPathway, UserByIdLoader, MilestoneByOnPathway

OnPathwayObjectType=ObjectType("OnPathway")

@OnPathwayObjectType.field("pathway")
async def resolve_on_pathway_pathway(obj=None, info=None, *_):
    return await PathwayByIdLoader.load_from_id(context=info.context, id=obj.pathway_id)

@OnPathwayObjectType.field("patient")
async def resolve_on_pathway_patient(obj=None, info=None, *_):
    return await PatientByIdLoader.load_from_id(context=info.context, id=obj.patient_id)

@OnPathwayObjectType.field("decisionPoints")
async def resolve_decision_points(obj=None, info=None, *_):
    return await DecisionPointsByOnPathway.load_many_from_id(context=info.context, id=obj.id)

@OnPathwayObjectType.field("underCareOf")
async def resolve_under_care_of(obj=None, info=None, *_):
    return await UserByIdLoader.load_from_id(context=info.context, id=obj.under_care_of_id)

@OnPathwayObjectType.field("milestones")
async def resolver(obj=None, info=None, notOnDecisionPoint:bool=True, *_):
    return await MilestoneByOnPathway.load_many_from_id(context=info.context, id=obj.id, notOnDecisionPoint=notOnDecisionPoint)