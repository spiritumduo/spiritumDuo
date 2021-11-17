from ariadne import gql
from .query_type import query
from api.dataloaders import ConfigurationLoader

type_defs = gql(
    """
    extend type Query {
        getConfiguration: Configuration
    }
"""
)

@query.field("getConfiguration")
async def resolve_get_configuration(obj=None, info=None):
    configuration=await ConfigurationLoader.load_configuration(info.context, 1)
    return configuration or None