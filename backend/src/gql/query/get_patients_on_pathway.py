from .query_type import query
from models.OnPathway import OnPathway
from models.Patient import Patient
# from dataloaders.patient import PatientByIdLoaderLoader

@query.field("getPatientsOnPathway")
async def resolve_get_patients_on_pathway(
        obj=None, info=None, pathwayId=None, awaitingDecisionType=None, isDischarged=False
):
    query = OnPathway.query.where(OnPathway.pathway == int(pathwayId)).where(OnPathway.is_discharged == isDischarged)
    if awaitingDecisionType is not None:
        query = query.where(OnPathway.awaiting_decision_type == awaitingDecisionType)
    print("HERE")
    res = await query.gino.all()
    patient_ids = []
    for r in res:
        patient_ids.append(r.patient)
    print(patient_ids)
    patients = await Patient.query.where(Patient.id.in_(patient_ids)).gino.all()
    return patients