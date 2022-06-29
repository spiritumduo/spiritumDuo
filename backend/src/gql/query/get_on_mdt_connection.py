from typing import List
from dataloaders import OnMdtByIdLoader
from .pagination import make_connection, validate_parameters
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import OnMdt
from models.db import db
from .query_type import query


@query.field("getOnMdtConnection")
@needsAuthorization([Permissions.MDT_READ, Permissions.PATIENT_READ])
async def get_mdt_connection(
    obj=None, info: GraphQLResolveInfo = None, first=None,
    after=None, last=None, before=None, mdtId=None
):
    validate_parameters(first, after, last, before)

    async with db.acquire(reuse=False) as conn:
        on_mdt_list: List[OnMdt] = await conn.all(
            OnMdt.query.where(
                OnMdt.mdt_id == int(mdtId)
            )
        )
    for on_mdt in on_mdt_list:
        OnMdtByIdLoader.prime(on_mdt.id, on_mdt, context=info.context)

    return make_connection(on_mdt_list, before, after, first, last)
