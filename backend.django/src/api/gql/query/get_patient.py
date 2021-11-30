from .query_type import query
from api.dataloaders import PatientLoader, PatientLoaderByHospitalNumber

@query.field("getPatient")
async def resolve_get_patient(obj=None, info=None, id=None, hospitalNumber=None):
    if not id and not hospitalNumber:
        return None
    if id:
        patient=await PatientLoader.load_from_id(info.context, id)
    else:
        patient=await PatientLoaderByHospitalNumber.load_data(info.context, hospitalNumber)
    return patient