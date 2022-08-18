from typing import Dict, List
from models import Pathway, PathwayClinicalRequestType
from common import (
    MutationUserErrorHandler,
    PathwayPayload
)
from asyncpg.exceptions import UniqueViolationError


async def CreatePathway(
    context: dict = None,
    name: str = None,
    clinical_request_types: List[Dict[str, int]] = None,
):
    """
    Creates a pathway object in the local database

    :param context: the current request context
    :param name: the name of the pathway
    :param clinical_request_types: list of clinical request type IDs

    :return: PathwayPayload object

    :raise TypeError: invalid parameters
    """

    if context is None:
        raise TypeError("Context cannot be None type")
    if name is None:
        raise TypeError("Name cannot be None type")
    if clinical_request_types is None:
        raise TypeError("clinical_request_types cannot be None type")

    errors = MutationUserErrorHandler()

    try:
        pathway: Pathway = await Pathway.create(
            name=name
        )

        for clinicalRequestType in clinical_request_types:
            await PathwayClinicalRequestType.create(
                pathway_id=int(pathway.id),
                clinical_request_type_id=int(clinicalRequestType['id'])
            )

        return PathwayPayload(pathway=pathway)

    except UniqueViolationError:
        errors.addError(
            field="name",
            message="A pathway with this name already exists"
        )
        return PathwayPayload(user_errors=errors.errorList)
