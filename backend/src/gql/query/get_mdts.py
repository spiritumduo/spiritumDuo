from datetime import date
from typing import List
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import MDT
from .query_type import query
from dataloaders import MdtByIdLoader


@query.field("getMdts")
@needsAuthorization([Permissions.MDT_READ])
async def resolve_get_mdts(
    obj=None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None,
    includePast: bool = None,
):
    query: str = MDT.query.where(
        MDT.pathway_id == int(pathwayId)
    )
    if not includePast:
        query = query.where(
            MDT.planned_at >= date.today()
        )
    result: List[MDT] = await query.gino.all()

    for mdt in result:
        MdtByIdLoader.prime(mdt.id, mdt, info.context)

    return result
