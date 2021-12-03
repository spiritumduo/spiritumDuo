from .mutation_type import mutation
from datacreators import CreatePathway
@mutation.field("createPathway")
async def resolve_create_pathway(_=None, info=None, input=None):
    return await CreatePathway(
        context=info.context,
        name=input['name']
    )