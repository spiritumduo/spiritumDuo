from SdTypes import Permissions
from dataupdaters import UpdatePathway
from models import Pathway
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("updatePathway")
@needsAuthorization([Permissions.PATHWAY_UPDATE])
async def resolve_update_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
) -> Pathway:
    return await UpdatePathway(
        context=info.context,
        id=input['id'],
        name=input['name'],
        milestone_types=input['milestoneTypes'] if 'milestoneTypes' in input else None
    )
