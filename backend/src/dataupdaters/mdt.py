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
    userErrors: MutationUserErrorHandler = None
):
    userErrors = MutationUserErrorHandler()
    if id is None:
        raise ReferencedItemDoesNotExistError("ID not provided")
    elif plannedAt is None:
        raise ReferencedItemDoesNotExistError("plannedAt not provided")
    elif location is None:
        raise ReferencedItemDoesNotExistError("location not provided")
    elif context is None:
        raise ReferencedItemDoesNotExistError("Context not provided")
    elif users is None:
        raise ReferencedItemDoesNotExistError("Users list not provided")

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
