from SdTypes import Permissions
from models import OnMdt
from dataupdaters import UpdateOnMDT
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("updateOnMdt")
@needsAuthorization([Permissions.ON_MDT_UPDATE])
async def resolve_update_on_mdt(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
) -> OnMdt:
    return await UpdateOnMDT(
        context=info.context,
        id=input['id'],
        reason=input['reason'],
        actioned=input['actioned'],
        outcome=input['outcome'] if 'outcome' in input else '',
    )
