import graphene
from .graphql.patient.schema import PatientQueries, PatientMutations
from .graphql.configuration.schema import ConfigurationQueries, ConfigurationMutations
from .graphql.role.schema import RoleQueries, RoleMutations
from .graphql.decisionpoint.schema import DecisionPointMutations, DecisionPointQueries
from .graphql.user.schema import UserMutations, UserQueries

from .graphql.login.schema import LoginMutations

class Queries(
    PatientQueries,
    ConfigurationQueries,
    RoleQueries,
    DecisionPointQueries,
    UserQueries
):pass
class Mutations(
    PatientMutations,
    ConfigurationMutations,
    RoleMutations,
    DecisionPointMutations,
    UserMutations,

    LoginMutations
):pass

schema = graphene.Schema(query=Queries, mutation=Mutations)