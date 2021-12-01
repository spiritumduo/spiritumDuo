from .query_type import query
from dataloaders import PatientDataLoader

@query.field("getPatient")
async def resolve_get_patient(obj=None, info=None, id=None):
    """
        temp measure until hosp no factored in
    """
    if not id:
        return None
    else:
        return await PatientDataLoader.load_from_id(info.context, id)