from sqlalchemy import or_, and_
from dataloaders import PatientByIdLoader
from .query_type import query
from models import OnPathway, DecisionPoint, Milestone, db
from SdTypes import MilestoneState
from .pagination import make_connection
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@needsAuthorization(["authenticated"])
@query.field("getPatientOnPathwayConnection")
async def get_patient_connection(
        obj=None, info: GraphQLResolveInfo = None, pathwayId=None,
        awaitingDecisionType=None, includeDischarged=False,
        first=None, after=None, last=None, before=None, outstanding=True,
        underCareOf=False
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

    db_query = db.select([OnPathway.patient_id.label("patient_id")])\
        .where(OnPathway.pathway_id == int(pathwayId))\

    if includeDischarged is False:
        db_query = db_query.where(OnPathway.is_discharged == False)

    if outstanding:
        db_query = db_query.select_from(
            db.join(
                OnPathway,
                DecisionPoint,
                OnPathway.id == DecisionPoint.on_pathway_id,
                isouter=True
            ).join(
                Milestone,
                DecisionPoint.id == Milestone.decision_point_id,
                isouter=True
            )
        )
        db_query = db_query.where(
                or_(
                    and_(
                        Milestone.fwd_decision_point_id.is_(None),
                        Milestone.current_state == MilestoneState.COMPLETED
                    ),
                    DecisionPoint.id.is_(None)
                )
            ).group_by(OnPathway.id)
    if awaitingDecisionType is not None:
        db_query = db_query.where(
            OnPathway.awaiting_decision_type == awaitingDecisionType
        )

    if underCareOf:
        db_query = db_query.where(
            or_(
                OnPathway.under_care_of_id == int(
                    info.context['request']['user'].id
                ),
                OnPathway.under_care_of_id.is_(None)
            )
        )

    db_query = db_query.order_by(OnPathway.id)
    all_patients_on_pathways = await db_query.gino.all()
    patients_ids = [pp.patient_id for pp in all_patients_on_pathways]
    patients = await PatientByIdLoader.load_many_from_id(
        info.context,
        patients_ids
    )

    return make_connection(patients, before, after, first, last)
