from ariadne.objects import ObjectType
from models import OnPathway, DecisionPoint

PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("pathways")    
async def resolve_patient_pathways(obj=None, info=None, *_):
    _gino=info.context['db']

    onPathwayInstances=None
    async with _gino.acquire(reuse=False) as conn:
        onPathwayInstances=await conn.all(OnPathway.query.where(OnPathway.patient==obj.id))

    for row in onPathwayInstances:
        row.awaiting_decision_type=row.awaiting_decision_type.value
    return onPathwayInstances

@PatientObjectType.field("decisionPoints")
async def resolve_patient_decision_points(obj=None, info=None, *_):
    _gino=info.context['db']

    decisionPoints=None
    async with _gino.acquire(reuse=False) as conn:
        decisionPoints=await conn.all(DecisionPoint.query.where(DecisionPoint.patient==obj.id))

    for row in decisionPoints:
        row.decision_type=row.decision_type.value
    return decisionPoints