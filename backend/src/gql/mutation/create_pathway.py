from .mutation_type import mutation
from datacreators import CreatePathway
from authentication.authentication import needsAuthorization

@mutation.field("createPathway")
@needsAuthorization(["authenticated"])
async def resolve_create_pathway(_=None, info=None, input=None):
    return await CreatePathway(
        context=info.context,
        name=input['name']
    )