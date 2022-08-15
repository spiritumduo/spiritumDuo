from SdTypes import Permissions
from common import MutationUserErrorHandler, BaseMutationPayload
from models import db
from dataupdaters import UpdateOnMDT
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("updateOnMdtList")
@needsAuthorization([Permissions.ON_MDT_UPDATE])
async def resolve_update_on_mdt_list(
    _=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
):
    async with db.acquire(reuse=False) as conn:
        async with conn.transaction():
            results = []
            for i in input['onMdtList']:
                payload = await UpdateOnMDT(
                    context=info.context,
                    id=i['id'],
                    reason=i['reason'] if 'reason' in i else None,
                    actioned=i['actioned'] if 'actioned' in i else None,
                    outcome=i['outcome'] if 'outcome' in i else None,
                    order=i['order'] if 'order' in i else None,
                    conn=conn,
                )
                if payload.user_errors:
                    await conn.rollback()
                    return BaseMutationPayload(user_errors=payload.user_errors)
                results.append(payload.on_mdt)

            return {
                "on_mdt_list": results,
            }
