from models import Pathway
from gettext import gettext as _
from asyncpg.exceptions import UniqueViolationError

class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item does not 
        exist and cannot be found when it should
    """
async def CreatePathway(
    context:dict=None,
    name:str=None
):
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    if not name:
        raise ReferencedItemDoesNotExistError("Name is not provided.")

    try:
        _pathway=await Pathway.create(
            name=name
        )
    except UniqueViolationError:
        return{
            "userErrors":[
                {"field":"name", "message":_("A pathway with this name already exists.")}
            ]
        }

    return{
        "pathway":_pathway
    }