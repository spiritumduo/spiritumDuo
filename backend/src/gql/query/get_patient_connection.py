from dataloaders import PatientByIdLoader
from .query_type import query
from models import OnPathway, DecisionPoint, Milestone
from SdTypes import MilestoneState
from .pagination import *
from authentication.authentication import needsAuthorization


@needsAuthorization(["authenticated"])
@query.field("getPatientOnPathwayConnection")
async def get_patient_connection(
        _, info, pathwayId=None, awaitingDecisionType=None, isDischarged=False,
        first=None, after=None, last=None, before=None, outstanding=True
):
    #  We only want to do forward OR backward pagination. Never both!
    if after is not None and before is not None:
        raise ValueError("Before and after both set")

    if after is not None and first is None:
        raise ValueError("After requires first argument")

    if before is not None and last is None:
        raise ValueError("Before requires last argument")

    # We want a limit on initial query
    if before is None and after is None and first is None:
        raise ValueError("Require first argument if no cursors present")

    db_query = OnPathway.query.where(OnPathway.pathway_id == int(pathwayId))\
        .where(OnPathway.is_discharged == isDischarged)
    if awaitingDecisionType is not None:
        db_query = db_query.where(OnPathway.awaiting_decision_type == awaitingDecisionType)
    db_query.order_by(OnPathway.added_at.asc())
    all_patients_on_pathways = await db_query.gino.all()

    patients_ids = []
    patients = None
    if outstanding:
        """
        this is the logic behind showing patients up on the homepage
        this checks to see if the patient has an outstanding 
        decision point left. it checks if there are decision points,
        if there are milestones associated with that decision point,
        and if the milestones are complete and have not been used 
        in a further decision point
        """
        for onPathwayRecord in all_patients_on_pathways:
            _isRecordOutstanding=False
            decisionPoints=await DecisionPoint.query.where(DecisionPoint.on_pathway_id==onPathwayRecord.id).gino.all()
            if not decisionPoints: _isRecordOutstanding=True
            for decisionPoint in decisionPoints:
                milestones=await Milestone.query.where(Milestone.decision_point_id==decisionPoint.id)\
                    .where(Milestone.current_state==MilestoneState.COMPLETED)\
                    .where(Milestone.fwd_decision_point_id==None)\
                    .gino.all()
                if milestones: _isRecordOutstanding=True; break
                if not await Milestone.query.where(Milestone.decision_point_id==decisionPoint.id).gino.all(): _isRecordOutstanding=True; break
                        
            if _isRecordOutstanding:
                patients_ids.append(onPathwayRecord.patient_id)
    else:
        for pp in all_patients_on_pathways:
            patients_ids.append(pp.patient_id)

    patients = await PatientByIdLoader.load_many_from_id(info.context, patients_ids)
    return make_connection(patients, before, after, first, last)
