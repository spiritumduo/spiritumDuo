from .mutation_type import mutation
from api.datacreation import CreatePatient

@mutation.field("createPatient")
async def resolve_create_patient(_=None, info=None, input=None):
    return await CreatePatient(
        first_name=input["firstName"],
        last_name=input["lastName"],
        communication_method=input["communicationMethod"],
        hospital_number=input["hospitalNumber"],
        national_number=input["nationalNumber"],
        date_of_birth=input["dateOfBirth"],
    )