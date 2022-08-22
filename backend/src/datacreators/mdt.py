from datetime import date
from asyncpg import UniqueViolationError
from models import MDT
from common import (
    MutationUserErrorHandler,
    MdtPayload
)


async def CreateMDT(
    context: dict = None,
    plannedAt: date = None,
    pathwayId: int = None,
    location: str = None,
):
    """
    Creates an MDT object in the local database

    :param context: the current request context
    :param plannedAt: date of MDT
    :param pathwayId: ID of pathway the MDT is on
    :param location: Display value of location of event

    :return: MdtPayload object

    :raise TypeError: invalid arguments
    """
    errors = MutationUserErrorHandler()

    if context is None:
        raise TypeError("context cannot be None type")
    if plannedAt is None:
        raise TypeError("plannedAt cannot be None type")
    if pathwayId is None:
        raise TypeError("pathwayId cannot be None type")
    if location is None:
        raise TypeError("pathwayId cannot be None type")

    try:
        mdt: MDT = await MDT.create(
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
        return MdtPayload(user_errors=errors.errorList)

    return MdtPayload(mdt=mdt)
