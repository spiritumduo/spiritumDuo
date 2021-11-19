from ariadne import gql
from channels.db import database_sync_to_async
from api.models.Pathway import Pathway
from .query_type import query
from api.dataloaders import PathwayLoader

type_defs = gql(
    """
    extend type Query {
        getPathway(id: ID!): Pathway
        getPathways:[Pathway]
    }
    """
)

@query.field("getPathway")
async def resolve_get_pathway(obj=None, info=None, id=None):
    pathway=await PathwayLoader.load_from_id(info.context, id)
    return pathway or None

@query.field("getPathways")
async def resolve_get_pathways(obj=None, info=None):
    return await PathwayLoader.load_all()