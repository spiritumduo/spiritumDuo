import graphene
from api.dao.DecisionPointDAO import DecisionPointDAO
from .types import DecisionPointType, _InputDecisionPointType

class CreateDecisionPoint(graphene.Mutation):
    decisionpoint=graphene.Field(DecisionPointType)
    class Arguments:
        decisionpointInput=graphene.Argument(_InputDecisionPointType)
    def mutate(self, info, decisionpointInput):
        newDecisionPoint=DecisionPointDAO(
            patient=decisionpointInput.patient,
            clinician=decisionpointInput.clinician,
            type=decisionpointInput.type,
            addedAt=decisionpointInput.addedAt,
            updatedAt=decisionpointInput.updatedAt,
            clinicHistory=decisionpointInput.clinicHistory,
            comorbidities=decisionpointInput.comorbidities
        )
        return CreateDecisionPoint(decisionpoint=newDecisionPoint.save())