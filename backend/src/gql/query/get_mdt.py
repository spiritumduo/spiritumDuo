from datetime import date
from .query_type import query
from dataloaders import MdtByIdLoader
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import MDT


@query.field("getMdt")
@needsAuthorization([Permissions.MDT_READ])
async def resolve_get_mdt(
    obj=None,
    info: GraphQLResolveInfo = None,
    id: int = None,
    pathwayId: int = None,
    plannedAt: date = None,
):
    if MdtByIdLoader.loader_name not in info.context:
        info.context[MdtByIdLoader.loader_name] = \
            MdtByIdLoader(db=info.context['db'])

    if id:
        return await MdtByIdLoader.load_from_id(context=info.context, id=id)

    mdt: MDT = await MDT.query.where(
        MDT.pathway_id == int(pathwayId)
    ).where(MDT.planned_at == plannedAt)\
        .gino.one_or_none()

    if mdt:
        info.context[MdtByIdLoader.loader_name].prime(
            mdt.id,
            mdt,
            info.context
        )
    return mdt
