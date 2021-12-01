from .query_type import query
from dataloaders import PatientByIdLoader, PatientByHospitalNumberLoader

@query.field("getPatient")
async def resolve_get_patient(obj=None, info=None, id=None, hospitalNumber=None):
    if id:
        return await PatientByIdLoader.load_from_id(info.context, id)
    elif hospitalNumber:
        return await PatientByHospitalNumberLoader.load_from_id(info.context, hospitalNumber)
    else:
        return None