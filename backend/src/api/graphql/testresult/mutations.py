import graphene
from api.dao.TestResultDAO import TestResultDAO
from .types import TestResultType, _InputTestResultType
from api.dao import PatientDAO

class CreateTestResult(graphene.Mutation):
    data=graphene.Field(TestResultType)
    class Arguments:
        input=graphene.Argument(_InputTestResultType, required=True)
    def mutate(self, info, input):
        patientRecord=PatientDAO.read(id=input.patient, dataOnly=True) # get patient object from ID
        testResult=TestResultDAO(
            patient=patientRecord,
            added_at=input.added_at,
            description=input.description,
            media_urls=input.media_urls
        )
        testResult.save()
        return CreateTestResult(data=testResult)