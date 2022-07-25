from models import MDT, OnMdt, UserPathway
from models.db import db


class OnMdtLockedByOtherUser(Exception):
    """
    This is raised when a modification to an OnMdt
    record is attempted without the user owning the
    lock to the record.
    """


async def UpdateOnMDT(
    context: dict = None,
    id: int = None,
    reason: str = None,
    outcome: str = None,
):
    if id is None:
        raise TypeError("ID is None")
    elif context is None:
        raise TypeError("Context is None")
    elif reason is None:
        raise TypeError("Reason is None")

    query: str = OnMdt.join(MDT, OnMdt.mdt_id == MDT.id)\
        .join(UserPathway, MDT.pathway_id == UserPathway.pathway_id)\
        .select()\
        .where(
            OnMdt.id == int(id)
        ).where(
            UserPathway.user_id == context['request'].user.id
        ).distinct(UserPathway.user_id)\
        .execution_options(loader=OnMdt)

    async with db.acquire(reuse=False) as conn:
        on_mdt: OnMdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    if on_mdt.lock_user_id != context["request"].user.id:
        raise OnMdtLockedByOtherUser()

    if outcome is not None:
        await on_mdt.update(reason=reason, outcome=outcome).apply()
    else:
        await on_mdt.update(reason=reason).apply()

    return on_mdt
