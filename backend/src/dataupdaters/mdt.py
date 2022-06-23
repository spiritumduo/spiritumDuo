from models import MDT
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError
from datetime import date


async def UpdateMDT(
    context: dict = None,
    id: int = None,
    plannedAt: date = None,
    location: str = None,
    userErrors: DataCreatorInputErrors = None
):
    userErrors = DataCreatorInputErrors()
    if id is None:
        raise ReferencedItemDoesNotExistError("ID not provided")
    elif plannedAt is None:
        raise ReferencedItemDoesNotExistError("plannedAt not provided")
    elif location is None:
        raise ReferencedItemDoesNotExistError("location not provided")
    elif context is None:
        raise ReferencedItemDoesNotExistError("Context not provided")

    try:
        mdt: MDT = await MDT.get(int(id))
        await mdt.update(planned_at=plannedAt)\
            .update(location=location).apply()
    except UniqueViolationError:
        userErrors.addError("Name", "An MDT exists for this date already")
        return userErrors

    return mdt
