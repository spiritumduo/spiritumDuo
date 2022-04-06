# onPathwayUpdated
import logging
from typing import Any, AsyncGenerator

from dependency_injector.wiring import Provide, inject
from graphql import GraphQLResolveInfo

from containers import SDContainer
from models import OnPathway
from .subscription_type import subscription


@subscription.source("onPathwayUpdated")
@inject
async def milestone_resolved_generator(
    _: Any = None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None,
    pub=Provide[SDContainer.pubsub_service]
) -> AsyncGenerator:
    """
        this needs to update on:
            - decision point submission \/
            - patient lock \/
            - patient unlock \/
            - import milestone \/
            - test result completion
    """
    topic = pub.subscribe("on-pathway-updated")
    log = logging.getLogger("uvicorn")
    log.debug(f"TOPIC: {topic}")
    async with topic as subscriber:
        async for on_pathway in subscriber:
            if on_pathway.pathway_id == pathwayId:
                log.info(
                    f"ON_PATHWAY_UPDATED SUBSCRIPTION RESOLVER: {on_pathway}"
                )
                yield on_pathway


@subscription.field("onPathwayUpdated")
async def on_pathway_updated_field(
    obj: OnPathway = None,
    info: GraphQLResolveInfo = None
):
    return obj
