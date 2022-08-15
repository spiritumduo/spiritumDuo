from common import MutationUserErrorHandler, DeletePayload
from .mutation_type import mutation
from models import MDT, OnMdt, UserPathway
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models.db import db


@mutation.field("deleteOnMdt")
@needsAuthorization([Permissions.ON_MDT_DELETE])
async def resolve_remove_pt_from_mdt(
    obj=None, info: GraphQLResolveInfo = None, id: str = None
) -> bool:
    errors: MutationUserErrorHandler = MutationUserErrorHandler()

    query: str = OnMdt.join(MDT, OnMdt.mdt_id == MDT.id)\
        .join(UserPathway, MDT.pathway_id == UserPathway.pathway_id)\
        .select()\
        .where(
            OnMdt.id == int(id)
        ).where(
            UserPathway.user_id == info.context['request'].user.id
        ).distinct(UserPathway.user_id)\
        .execution_options(loader=OnMdt)

    async with db.acquire(reuse=False) as conn:
        on_mdt: OnMdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    if on_mdt.lock_user_id != info.context["request"].user.id:
        errors.addError(
            'lock_user_id',
            'This is locked by another user'
        )
        return DeletePayload(user_errors=errors.errorList)

    await on_mdt.delete()

    return DeletePayload(success=True)
