from .mutation_type import mutation

@mutation.field("createPatient")
async def resolve_create_patient(_=None, info=None, input=None):
    pass
