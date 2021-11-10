import graphene

from .mutations import createConfiguration
from .queries import _ConfigurationQueries
from .types import ConfigurationType

class ConfigurationQueries(_ConfigurationQueries, graphene.ObjectType):
    get_configuration=graphene.List(ConfigurationType)

    # this way we can keep it modular for permission decorators
    def resolve_get_configuration(root, info):
        return _ConfigurationQueries._resolve_get_configuration(root, info)

class ConfigurationMutations(graphene.ObjectType):
    create_configuration=createConfiguration.Field()