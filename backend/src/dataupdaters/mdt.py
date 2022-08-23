from typing import List, Set
from models import MDT, UserMDT, User
from common import MutationUserErrorHandler, MdtPayload
from asyncpg.exceptions import UniqueViolationError
from datetime import date


async def UpdateMDT(
    context: dict = None,
    id: int = None,
    plannedAt: date = None,
    location: str = None,
    users: List[str] = None,
):
    """
    Updates a given MDT object

    :param context: request context
    :param id: id of MDT object
    :param plannedAt: datetime of MDT
    :param location: location of MDT
    :param users: user accounts of clinicians present

    :return MdtPayload:

    :raise TypeError:
    """

    if id is None:
        raise TypeError("id cannot be none type")
    elif plannedAt is None:
        raise TypeError("plannedAt cannot be none type")
    elif location is None:
        raise TypeError("location cannot be none type")
    elif context is None:
        raise TypeError("context cannot be none type")
    elif users is None:
        raise TypeError("users cannot be none type")

    userErrors = MutationUserErrorHandler()

    mdt: MDT = await MDT.get(int(id))

    selected_users: Set[User] = set(await User.query.where(
        User.id.in_([int(user_id) for user_id in users])).gino.all())

    current_user_mdts: Set[UserMDT] = set(await UserMDT.query.where(
        UserMDT.mdt_id == int(id)
    ).gino.all())

    users_to_remove = current_user_mdts - selected_users
    users_to_add = selected_users - current_user_mdts

    for user in users_to_remove:
        await user.delete()
    for user in users_to_add:
        await UserMDT.create(
            mdt_id=int(mdt.id),
            user_id=int(user.id)
        )

    try:
        await mdt.update(planned_at=plannedAt)\
            .update(location=location).apply()
    except UniqueViolationError:
        userErrors.addError("Name", "An MDT exists for this date already")
        return MdtPayload(user_errors=userErrors.errorList)

    return MdtPayload(mdt=mdt)
