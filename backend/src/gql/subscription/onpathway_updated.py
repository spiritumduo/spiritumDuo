from typing import Any, AsyncGenerator
from dependency_injector.wiring import Provide, inject
from graphql import GraphQLResolveInfo
from containers import SDContainer
from models import OnPathway
from .subscription_type import subscription


@subscription.source("onPathwayUpdated")
@inject
async def on_pathway_updated_generator(
    _: Any = None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None,
    includeDischarged: bool = False,
    pub=Provide[SDContainer.pubsub_service]
) -> AsyncGenerator:
    topic = pub.subscribe("on-pathway-updated")
    async with topic as subscriber:
        async for on_pathway in subscriber:
            if int(on_pathway.pathway_id) == int(pathwayId):
                if (
                    (not includeDischarged and
                        not on_pathway.is_discharged)
                    or includeDischarged
                ):
                    yield on_pathway


@subscription.field("onPathwayUpdated")
async def on_pathway_updated_field(
    obj: OnPathway = None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None,
    includeDischarged: bool = None,
):
    return obj
