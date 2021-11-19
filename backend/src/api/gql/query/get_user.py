from ariadne import gql
from .query_type import query
from api.dataloaders import UserLoader

type_defs = gql(
    """
    extend type Query {
        getUser(id: ID!): User
    }
"""
)

@query.field("getUser")
async def resolve_get_user(obj=None, info=None, id=None):
    patient=await UserLoader.load_from_id(info.context, id)
    return patient or None