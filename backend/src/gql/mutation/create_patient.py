from models import Patient
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from datacreators.patient import CreatePatient


@mutation.field("createPatient")
@needsAuthorization(["authenticated"])
async def resolve_create_patient(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None
) -> Patient:
    patientInfo = {
        "first_name": input["firstName"],
        "last_name": input["lastName"],
        "hospital_number": input["hospitalNumber"],
        "national_number": input["nationalNumber"],
        "date_of_birth": input["dateOfBirth"],
        "pathwayId": input["pathwayId"],
        "context": info.context
    }
    if 'communicationMethod' in input:
        patientInfo['communication_method'] = input['communicationMethod']
    if 'awaitingDecisionType' in input:
        patientInfo['awaiting_decision_type'] = input['awaitingDecisionType']
    if 'referredAt' in input:
        patientInfo['referred_at'] = input['referredAt']
    if 'milestones' in input:
        patientInfo['milestones'] = input['milestones']

    return await CreatePatient(
        **patientInfo
    )
