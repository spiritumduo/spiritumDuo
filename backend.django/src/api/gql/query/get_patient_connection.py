from api.common import db_sync_to_async
from api.dataloaders import PatientLoader
from .query_type import query
from api.models import PatientPathwayInstance, DecisionPoint
from .pagination import *


@db_sync_to_async
def get_patient_pathway_instances(pathway_id=None, awaiting_decision_type=None, is_discharged=False):
    dv = awaiting_decision_type.value
    dl = awaiting_decision_type.label
    dt = (str(dv), str(dl))
    dstr = str(dt)  #  This is horrible. For some reason we can't just put the decision point type straight in?
    return list(PatientPathwayInstance.objects.filter(
        pathway_id=pathway_id,  awaiting_decision_type=dstr, is_discharged=is_discharged
    ).order_by('updated_at'))


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

    d_type = DecisionPoint.DecisionPointType[awaitingDecisionType]

    all_patients_on_pathways = await get_patient_pathway_instances(
        pathway_id=int(pathwayId), awaiting_decision_type=d_type, is_discharged=isDischarged
    )

    patients_ids = []

    for pp in all_patients_on_pathways:
        patients_ids.append(pp.patient_id)

    patients = await PatientLoader.load_many_patients(info.context, patients_ids)

    return make_connection(patients, before, after, first, last)