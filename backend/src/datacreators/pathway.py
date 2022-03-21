from models import Pathway
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError


async def CreatePathway(
    context: dict = None,
    name: str = None
):
    """
    Creates a decision point object in the local database

    Keyword arguments:
        context (dict): the current request context
        name (string): the name of the pathway
    Returns:
        Pathway/DataCreatorInputErrors: newly created pathway object/errors
            object
    """
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    if not name:
        raise ReferencedItemDoesNotExistError("Name is not provided.")

    try:
        return await Pathway.create(
            name=name
        )
    except UniqueViolationError:
        return DataCreatorInputErrors().addError(
            field="name",
            message="A pathway with this name already exists"
        )
