from .query_type import query
from dataloaders import ClinicalRequestTypeLoader, ClinicalRequestTypeLoaderByPathwayId
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions


@query.field("getClinicalRequestTypes")
@needsAuthorization([Permissions.MILESTONE_TYPE_READ])
async def resolve_get_clinical_request_types(
    obj=None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None
):
    if pathwayId is None:
        return await ClinicalRequestTypeLoader.load_all(info.context)
    else:
        return await ClinicalRequestTypeLoaderByPathwayId.load_from_id(
            info.context, pathwayId)
