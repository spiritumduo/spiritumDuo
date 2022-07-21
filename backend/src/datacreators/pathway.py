from typing import Dict, List
from models import Pathway, PathwayClinicalRequestType
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError


async def CreatePathway(
    context: dict = None,
    name: str = None,
    clinical_request_types: List[Dict[str, int]] = None,
):
    """
    Creates a decision point object in the local database

    Keyword arguments:
        context (dict): the current request context
        name (string): the name of the pathway
        clinicalRequestTypes (list): list of clinical_request type IDs
    Returns:
        Pathway/DataCreatorInputErrors: newly created pathway object/errors
            object
    """
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    if not name:
        raise ReferencedItemDoesNotExistError("Name is not provided.")

    try:
        newPathway: Pathway = await Pathway.create(
            name=name
        )

        for clinicalRequestType in clinical_request_types:
            await PathwayClinicalRequestType.create(
                pathway_id=int(newPathway.id),
                clinical_request_type_id=int(clinicalRequestType['id'])
            )

        return newPathway
    except UniqueViolationError:
        return DataCreatorInputErrors().addError(
            field="name",
            message="A pathway with this name already exists"
        )
