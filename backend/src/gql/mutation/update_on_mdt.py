from SdTypes import Permissions
from common import DataCreatorInputErrors
from dataupdaters.on_mdt import OnMdtLockedByOtherUser
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
    errors: DataCreatorInputErrors = DataCreatorInputErrors()
    try:
        return await UpdateOnMDT(
            context=info.context,
            id=input['id'],
            reason=input['reason'],
            completed=input['completed'] if 'completed' in input else None,
            outcome=input['outcome'] if 'outcome' in input else '',
        )
    except OnMdtLockedByOtherUser:
        errors.addError(
            'lock_user_id',
            'This is locked by another user'
        )
        return errors
