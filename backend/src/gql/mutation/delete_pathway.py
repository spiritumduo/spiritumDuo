from asyncpg import ForeignKeyViolationError
from SdTypes import Permissions
from models import Pathway, db, PathwayClinicalRequestType
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from common import MutationUserErrorHandler, DeletePayload


@mutation.field("deletePathway")
@needsAuthorization([Permissions.PATHWAY_DELETE])
async def resolve_delete_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    id: int = None,
    userErrors: MutationUserErrorHandler = None,
) -> Pathway:
    userErrors = MutationUserErrorHandler()

    async with db.transaction():
        try:
            await PathwayClinicalRequestType.delete.where(
                PathwayClinicalRequestType.pathway_id == int(id)
            ).gino.status()
            pathway: Pathway = await Pathway.get(int(id))
            await pathway.delete()
            return DeletePayload(success=True)
        except ForeignKeyViolationError:
            userErrors.addError(
                "id", "You cannot remove a pathway with a relation")
            return DeletePayload(user_errors=userErrors.errorList)
