from typing import List
from dataloaders import MdtByIdLoader
from .pagination import make_connection, validate_parameters
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import MDT
from .query_type import query
from models.db import db


@query.field("getMdtConnection")
@needsAuthorization([Permissions.MDT_READ])
async def get_mdt_connection(
    obj=None, info: GraphQLResolveInfo = None, first=None,
    after=None, last=None, before=None, pathwayId=None
):
    validate_parameters(first, after, last, before)

    async with db.acquire(reuse=False) as conn:
        mdt_list: List[MDT] = await conn.all(
            MDT.query.where(
                MDT.pathway_id == int(pathwayId)
            ).order_by(MDT.planned_at.asc())
        )

    for mdt in mdt_list:
        MdtByIdLoader.prime(mdt.id, mdt, context=info.context)

    return make_connection(mdt_list, before, after, first, last)
