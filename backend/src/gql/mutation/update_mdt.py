from SdTypes import Permissions
from dataupdaters import UpdateMDT
from models import Pathway
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("updateMdt")
@needsAuthorization([Permissions.MDT_UPDATE])
async def resolve_update_mdt(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
) -> Pathway:
    return await UpdateMDT(
        context=info.context,
        id=input['id'],
        plannedAt=input['plannedAt'],
        location=input['location'],
        users=input['users']
    )
