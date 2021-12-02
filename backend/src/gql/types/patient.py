from ariadne.objects import ObjectType
from dataloaders import DecisionPointsByPatient, OnPathwaysByPatient
PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathways")    
async def resolve_patient_pathways(obj=None, info=None, pathwayId=None, *_):
    return await OnPathwaysByPatient.load_from_id(context=info.context, id=obj.id)

@PatientObjectType.field("decisionPoints")
async def resolve_patient_decision_points(obj=None, info=None, pathwayId=None, decisionType=None, limit=None, *_):
    return await DecisionPointsByPatient.load_from_id(context=info.context, id=obj.id, pathwayId=pathwayId, decisionType=decisionType, limit=limit)