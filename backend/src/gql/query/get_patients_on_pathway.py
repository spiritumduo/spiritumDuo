from .query_type import query
from models.OnPathway import OnPathway
from models.Patient import Patient
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@query.field("getPatientsOnPathway")
@needsAuthorization([Permissions.PATIENT_READ, Permissions.ON_PATHWAY_READ])
async def resolve_get_patients_on_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    pathwayId=None,
    awaitingDecisionType=None,
    isDischarged=False
):
    query = OnPathway.query.where(
        OnPathway.pathway_id == int(pathwayId)
    ).where(OnPathway.is_discharged == isDischarged)
    if awaitingDecisionType is not None:
        query = query.where(
            OnPathway.awaiting_decision_type == awaitingDecisionType
        )
    res = await query.gino.all()
    patient_ids = []
    for r in res:
        patient_ids.append(r.patient_id)
    print(patient_ids)
    patients = await Patient.query.where(
        Patient.id.in_(patient_ids)
    ).gino.all()
    return patients
