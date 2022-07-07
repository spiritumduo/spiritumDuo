from typing import Union
from asyncpg import ForeignKeyViolationError
from SdTypes import Permissions
from models import MDT, db
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from common import DataCreatorInputErrors


@mutation.field("deleteMdt")
@needsAuthorization([Permissions.MDT_DELETE])
async def resolve_delete_mdt(
    obj=None,
    info: GraphQLResolveInfo = None,
    id: int = None,
    userErrors: DataCreatorInputErrors = None,
) -> Union[bool, DataCreatorInputErrors]:
    userErrors = DataCreatorInputErrors()

    async with db.transaction() as tx:
        try:
            mdt: MDT = await MDT.get(int(id))
            if not mdt:
                userErrors.addError(
                    "id", "An MDT with this ID does not exist")
                return userErrors
            await mdt.delete()
            return True
        except ForeignKeyViolationError:
            userErrors.addError(
                "id", "You cannot remove an mdt with a relation")
            return userErrors
