from .query_type import query
from dataloaders import PatientByIdLoader
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import Patient


@query.field("getPathway")
@needsAuthorization([Permissions.PATIENT_READ])
@inject
async def resolve_search_patient(
    obj=None,
    info: GraphQLResolveInfo = None,
    query: str = None
):
    patients_query = Patient.query.gino.all()
    search_request =