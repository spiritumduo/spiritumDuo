from .query_type import query
from authentication.authentication import needsAuthorization
from SdTypes import Permissions
from models import User, UserPathway
from models.db import db


@query.field("getUsers")
@needsAuthorization([Permissions.USER_READ])
async def resolve_get_user(
    obj=None,
    info=None,
    pathwayId: int = None,
):
    query = User.query

    if pathwayId is not None:
        query = User.join(UserPathway).select()\
            .where(UserPathway.pathway_id == int(pathwayId))\
            .execution_options(loader=User)

    async with db.acquire(reuse=False) as conn:
        result = await conn.all(query)

    return result
