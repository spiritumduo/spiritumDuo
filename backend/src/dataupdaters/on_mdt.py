from common import ReferencedItemDoesNotExistError
from models import MDT, OnMdt, UserPathway
from models.db import db


async def UpdateOnMDT(
    context: dict = None,
    id: int = None,
    reason: str = None,
):
    if id is None:
        raise ReferencedItemDoesNotExistError("ID not provided")
    elif context is None:
        raise ReferencedItemDoesNotExistError("Context not provided")
    elif reason is None:
        raise ReferencedItemDoesNotExistError("Reason not provided")

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
        on_mdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    await on_mdt.update(reason=reason).apply()

    return on_mdt
