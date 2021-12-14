from .mutation_type import mutation
from datacreators import CreatePatient
from authentication.authentication import needsAuthorization

@mutation.field("createPatient")
@needsAuthorization(["authenticated"])
async def resolve_create_patient(_=None, info=None, input=None):
    patientInfo={
        "first_name":input["firstName"],
        "last_name":input["lastName"],
        "hospital_number":input["hospitalNumber"],
        "national_number":input["nationalNumber"],
        "date_of_birth":input["dateOfBirth"],
        "pathway":input["pathway"],
        "context":info.context
    }
    if 'communicationMethod' in input:
        patientInfo['communication_method']=input['communicationMethod']
    if 'awaitingDecisionType' in input:
        patientInfo['awaiting_decision_type']=input['awaitingDecisionType']
    if 'referredAt' in input:
        patientInfo['referred_at']=input['referredAt']

    return await CreatePatient(
        **patientInfo
    )