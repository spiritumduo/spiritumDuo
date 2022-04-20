from SdTypes import Permissions
from models import Pathway
from .mutation_type import mutation
from datacreators import CreatePathway
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("createPathway")
@needsAuthorization([Permissions.PATHWAY_CREATE])
async def resolve_create_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None
) -> Pathway:
    return await CreatePathway(
        context=info.context,
        name=input['name']
    )
