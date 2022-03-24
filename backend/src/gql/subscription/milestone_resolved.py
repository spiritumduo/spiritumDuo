import logging
from typing import Any, AsyncGenerator

from dependency_injector.wiring import Provide, inject
from graphql import GraphQLResolveInfo

from containers import SDContainer
from models import Milestone
from .subscription_type import subscription


@subscription.source("milestoneResolved")
@inject
async def milestone_resolved_generator(
    _: Any = None,
    info: GraphQLResolveInfo = None,
    clinicianID=None,
    pub=Provide[SDContainer.pubsub_service]
) -> AsyncGenerator:
    topic = pub.subscribe("milestone-resolutions")
    log = logging.getLogger("uvicorn")
    log.debug(f"TOPIC: {topic}")
    async with topic as subscriber:
        async for milestone in subscriber:
            log.info(f"MILESTONE_RESOLVED SUBSCRIPTION RESOLVER: {milestone}")
            yield milestone


@subscription.field("milestoneResolved")
async def milestone_resolved_field(
    obj: Milestone = None,
    info: GraphQLResolveInfo = None
):
    return obj
