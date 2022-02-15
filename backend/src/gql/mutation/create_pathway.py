from .mutation_type import mutation
from datacreators import CreatePathway
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo

@mutation.field("createPathway")
@needsAuthorization(["authenticated"])
async def resolve_create_pathway(obj=None, info:GraphQLResolveInfo=None, input:dict=None):
    return await CreatePathway(
        context=info.context,
        name=input['name']
    )