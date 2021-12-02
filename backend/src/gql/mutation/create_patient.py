from .mutation_type import mutation
from datacreators import CreatePatient
@mutation.field("createPatient")
async def resolve_create_patient(_=None, info=None, input=None):
    if 'communicationMethod' not in input and 'awaitingDecisionType' not in input:
        return await CreatePatient(
            first_name=input["firstName"],
            last_name=input["lastName"],
            hospital_number=input["hospitalNumber"],
            national_number=input["nationalNumber"],
            date_of_birth=input["dateOfBirth"],
            pathway=input["pathway"],
            context=info.context
        )
    elif 'communicationMethod' in input:
        return await CreatePatient(
            first_name=input["firstName"],
            last_name=input["lastName"],
            hospital_number=input["hospitalNumber"],
            national_number=input["nationalNumber"],
            date_of_birth=input["dateOfBirth"],
            pathway=input["pathway"],
            context=info.context,
            communication_method=input['communicationMethod'],
        )
    elif 'awaitingDecisionType' in input:
        return await CreatePatient(
            first_name=input["firstName"],
            last_name=input["lastName"],
            hospital_number=input["hospitalNumber"],
            national_number=input["nationalNumber"],
            date_of_birth=input["dateOfBirth"],
            pathway=input["pathway"],
            context=info.context,
            awaiting_decision_type=input["awaitingDecisionType"],
        )
    else:
        return await CreatePatient(
            first_name=input["firstName"],
            last_name=input["lastName"],
            hospital_number=input["hospitalNumber"],
            national_number=input["nationalNumber"],
            date_of_birth=input["dateOfBirth"],
            communication_method=input['communicationMethod'],
            pathway=input["pathway"],
            awaiting_decision_type=input["awaitingDecisionType"],
            context=info.context
        )