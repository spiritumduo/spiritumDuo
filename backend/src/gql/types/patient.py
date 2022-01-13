from ariadne.objects import ObjectType
from dataloaders import DecisionPointsByPatient, OnPathwaysByPatient
from models import Milestone
PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("onPathways")    
async def resolve_patient_pathways(obj=None, info=None, pathwayId=None, isDischarged=False, awaitingDecisionType=None, limit=None, *_):
    # TODO: add support for search parameters
    return await OnPathwaysByPatient.load_from_id(context=info.context, id=obj.id)

