from dependency_injector import containers, providers
import sdpubsub
import services
import trustadapter
from config import config as SDConfig


class SDContainer(containers.DeclarativeContainer):

    wiring_config = containers.WiringConfiguration(
        modules=[
            "dataloaders", "datacreators",
            "gql.mutation.create_decision_point",
            "gql.mutation.lock_on_pathway",
            "gql.mutation.create_decision_point",
            "gql.query",
            "gql.query.patient_search",
            "gql.subscription.milestone_resolved",
            "gql.subscription.onpathway_updated",
            "rest.update_test_result",
        ]
    )
    config = providers.Configuration()
    config.from_dict(SDConfig)

    trust_adapter = trustadapter.PseudoTrustAdapter
    pubsub = sdpubsub.SdPubSub

    # Gateways

    trust_adapter_client = providers.Singleton(trust_adapter)
    pubsub_client = providers.Singleton(pubsub)

    # Services

    trust_adapter_service = providers.Factory(
        services.TrustAdapterService,
        trust_adapter_client=trust_adapter_client
    )
    pubsub_service = providers.Factory(
        services.PubSubService,
        pubsub_client=pubsub_client
    )
