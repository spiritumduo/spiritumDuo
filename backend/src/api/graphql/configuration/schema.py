import graphene

from .mutations import CreateConfiguration
from .queries import _ConfigurationQueries
from .types import ConfigurationType

class ConfigurationQueries(_ConfigurationQueries, graphene.ObjectType):
    configuration=graphene.List(ConfigurationType)

    # this way we can keep it modular for permission decorators
    def resolve_configuration(root, info):
        return _ConfigurationQueries._resolve_configuration(root, info)

class ConfigurationMutations(graphene.ObjectType):
    create_configuration=CreateConfiguration.Field()