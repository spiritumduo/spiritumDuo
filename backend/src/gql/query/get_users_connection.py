from dataloaders import UserByIdLoader
from .pagination import make_connection, validate_parameters
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import User
from .query_type import query


@query.field("getUserConnection")
@needsAuthorization([Permissions.USER_READ])
async def get_patient_connection(
        obj=None, info: GraphQLResolveInfo = None,
        first=None, after=None, last=None, before=None
):
    validate_parameters(first, after, last, before)
    users = await User.query.gino.all()

    for u in users:
        UserByIdLoader.prime(u.id, u, context=info.context)

    return make_connection(users, before, after, first, last)
