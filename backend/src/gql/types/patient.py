from ariadne.objects import ObjectType
from dataloaders import DecisionPointsByPatient, OnPathwaysByPatient, MilestoneByPatientLoader
from models import Milestone
PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathways")    
async def resolve_patient_pathways(obj=None, info=None, pathwayId=None, *_):
    return await OnPathwaysByPatient.load_from_id(context=info.context, id=obj.id)

@PatientObjectType.field("decisionPoints")
async def resolve_patient_decision_points(obj=None, info=None, pathwayId=None, decisionType=None, limit=None, *_):
    return await DecisionPointsByPatient.load_from_id(context=info.context, id=obj.id, pathwayId=pathwayId, decisionType=decisionType, limit=limit)


@PatientObjectType.field("milestones")
async def resolve_patient_milestones(obj=None, info=None, pathwayId=None, *_):
    query = Milestone.query.where(Milestone.patient_id == obj.id)
    if pathwayId is not None:
        query = query.where(Milestone.on_pathway_id == pathwayId)
    query.order_by(Milestone.added_at.desc())

    async with info.context['db'].acquire(reuse=False) as conn:
        milestones = await conn.all(query)
        for m in milestones:
            MilestoneByPatientLoader.prime_with_context(info.context, m.id, m)
        return milestones
