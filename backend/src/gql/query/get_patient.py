from .query_type import query
from dataloaders import PatientByIdLoader, PatientByHospitalNumberLoader
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo

@query.field("getPatient")
@needsAuthorization(["authenticated"])
async def resolve_get_patient(obj=None, info:GraphQLResolveInfo=None, id:int=None, hospitalNumber:str=None):
    if id:
        return await PatientByIdLoader.load_from_id(info.context, id)
    elif hospitalNumber:
        return await PatientByHospitalNumberLoader.load_from_id(info.context, hospitalNumber)
    else:
        return None