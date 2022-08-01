import asyncio
from typing import List

from SdTypes import Permissions
from common import DataCreatorInputErrors
from dataupdaters.on_mdt import OnMdtLockedByOtherUser
from models import OnMdt, db
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
    errors: DataCreatorInputErrors = DataCreatorInputErrors()
    async with db.acquire(reuse=False) as conn:
        async with conn.transaction():
            results = []
            for i in input['onMdtList']:
                res = await UpdateOnMDT(
                    context=info.context,
                    id=i['id'],
                    reason=i['reason'] if 'reason' in i else None,
                    actioned=i['actioned'] if 'actioned' in i else None,
                    outcome=i['outcome'] if 'outcome' in i else None,
                    order=i['order'] if 'order' in i else None,
                    conn=conn,
                )
                results.append(res)

            return {
                "on_mdt_list": results,
            }
