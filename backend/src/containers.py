import logging.config
from dependency_injector import containers, providers

import services
import trustadapter
from config import config as SDConfig


class SDContainer(containers.DeclarativeContainer):

    wiring_config = containers.WiringConfiguration(
        modules=["dataloaders", "datacreators", "gql.mutation.create_decision_point", "gql.query"]
    )
    config = providers.Configuration()
    config.from_dict(SDConfig)

    thing = trustadapter.PseudoTrustAdapter

    # Gateways

    trust_adapter_client = providers.Singleton(thing)

    # Services

    trust_adapter_service = providers.Factory(services.TrustAdapterService, trust_adapter_client=trust_adapter_client)
