import graphene
from api.dao.DecisionPointDAO import DecisionPointDAO
from api.models import SdUser
from .types import DecisionPointType, _InputDecisionPointType

from api.dao import PatientDAO

class CreateDecisionPoint(graphene.Mutation):
    decisionPoint=graphene.Field(DecisionPointType)
    class Arguments:
        input=graphene.Argument(_InputDecisionPointType)
    def mutate(self, info, input):
        patientRecord=PatientDAO.read(id=input.patient, dataOnly=True) # get patient object from ID
        clinicianRecord=SdUser.objects.get(id=input.clinician) # get user object from ID; need to figure out DAO for user model
        decisionPoint=DecisionPointDAO(
            patient=patientRecord,
            clinician=clinicianRecord,
            type=input.type,
            added_at=input.added_at,
            updated_at=input.updated_at,
            clinic_history=input.clinic_history,
            comorbidities=input.comorbidities
        )
        decisionPoint.save()
        return CreateDecisionPoint(decisionPoint=decisionPoint)