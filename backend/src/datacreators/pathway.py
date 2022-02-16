from models import Pathway
from gettext import gettext as _
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError

async def CreatePathway(
    context:dict=None,
    name:str=None
):
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    if not name:
        raise ReferencedItemDoesNotExistError("Name is not provided.")

    try:
        return await Pathway.create(
            name=name
        )
    except UniqueViolationError:
        return DataCreatorInputErrors().addError(field="name", message="A pathway with this name already exists")
