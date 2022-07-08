from datetime import date
from asyncpg import UniqueViolationError
from models import MDT
from common import DataCreatorInputErrors, ReferencedItemDoesNotExistError


async def CreateMDT(
    context: dict = None,
    plannedAt: date = None,
    pathwayId: int = None,
    location: str = None,
    errors: DataCreatorInputErrors = None
):
    errors = DataCreatorInputErrors()
    """
    Creates an MDT object in the local database

    Keyword arguments:
        context (dict): the current request context
        plannedAt (date): date of MDT
    Returns:
        MDT/DataCreatorInputErrors: newly created MDT object/errors
            object
    """
    if not context:
        raise ReferencedItemDoesNotExistError("Context is not provided.")
    if not plannedAt:
        raise ReferencedItemDoesNotExistError("plannedAt is not provided.")
    if not pathwayId:
        raise ReferencedItemDoesNotExistError("pathwayId is not provided.")
    try:
        newMDT: MDT = await MDT.create(
            planned_at=plannedAt,
            pathway_id=int(pathwayId),
            creator_user_id=context['request'].user.id,
            location=location
        )
    except UniqueViolationError:
        errors.addError(
            "plannedAt, pathwayId",
            "An MDT already exists on this date for this pathway"
        )
        return errors

    return newMDT
