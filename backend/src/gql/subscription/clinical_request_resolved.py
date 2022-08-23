import logging
from typing import Any, AsyncGenerator

from dependency_injector.wiring import Provide, inject
from graphql import GraphQLResolveInfo

from SdTypes import Permissions
from authentication.authentication import needsAuthorization
from containers import SDContainer
from models import ClinicalRequest
from .subscription_type import subscription


@subscription.source("clinicalRequestResolved")
@needsAuthorization([Permissions.MILESTONE_READ])
@inject
async def clinical_request_resolved_generator(
    _: Any = None,
    info: GraphQLResolveInfo = None,
    clinicianID=None,
    pub=Provide[SDContainer.pubsub_service]
) -> AsyncGenerator:
    topic = pub.subscribe("clinicalRequest-resolutions")
    log = logging.getLogger("uvicorn")
    log.debug(f"TOPIC: {topic}")
    async with topic as subscriber:
        async for clinical_request in subscriber:
            log.info(
                f"MILESTONE_RESOLVED SUBSCRIPTION RESOLVER: {clinical_request}"
            )
            yield clinical_request


@subscription.field("clinicalRequestResolved")
async def clinical_request_resolved_field(
    obj: ClinicalRequest = None,
    info: GraphQLResolveInfo = None
):
    return obj
