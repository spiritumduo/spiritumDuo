import graphene

from api.dao.ConfigurationDAO import ConfigurationDAO

class _ConfigurationQueries(graphene.ObjectType):
    def _resolve_get_configuration(root, info):
        return ConfigurationDAO.read()