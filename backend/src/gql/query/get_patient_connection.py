from dataloaders import PatientByIdLoader
from .query_type import query
from models.OnPathway import OnPathway
from .pagination import *


@query.field("getPatientOnPathwayConnection")
async def get_patient_connection(
        _, info, pathwayId=None, awaitingDecisionType=None, isDischarged=False,
        first=None, after=None, last=None, before=None
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

    all_patients_on_pathways = await OnPathway.query.where(OnPathway.pathway == int(pathwayId))\
        .where(OnPathway.is_discharged == isDischarged)\
        .where(OnPathway.awaiting_decision_type == awaitingDecisionType).gino.all()

    patients_ids = []

    for pp in all_patients_on_pathways:
        patients_ids.append(pp.patient)

    patients = await PatientByIdLoader.load_many_from_id(info.context, patients_ids)

    return make_connection(patients, before, after, first, last)
