import graphene
from .graphql.patient.schema import PatientQueries, PatientMutations
from .graphql.configuration.schema import ConfigurationQueries, ConfigurationMutations
from .graphql.role.schema import RoleQueries, RoleMutations
from .graphql.decisionpoint.schema import DecisionPointMutations, DecisionPointQueries
from .graphql.user.schema import UserMutations, UserQueries
from .graphql.testresult.schema import TestResultQueries, TestResultMutations
from .graphql.pathway.schema import PathwayMutations, PathwayQueries
from .graphql.login.schema import LoginMutations

class Queries(
    PatientQueries,
    ConfigurationQueries,
    RoleQueries,
    DecisionPointQueries,
    UserQueries,
    TestResultQueries,
    PathwayQueries

):pass
class Mutations(
    PatientMutations,
    ConfigurationMutations,
    RoleMutations,
    DecisionPointMutations,
    UserMutations,
    TestResultMutations,
    LoginMutations,
    PathwayMutations
):pass

schema = graphene.Schema(query=Queries, mutation=Mutations)