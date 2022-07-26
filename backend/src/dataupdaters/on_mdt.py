from common import DataCreatorInputErrors, ReferencedItemDoesNotExistError
from models import MDT, OnMdt, UserPathway
from models.db import db
from gino.engine import GinoConnection


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
    actioned: bool = None,
    order: int = None,
    conn: GinoConnection = None,
):
    if id is None:
        raise ReferencedItemDoesNotExistError("ID not provided")
    elif context is None:
        raise ReferencedItemDoesNotExistError("Context not provided")

    query: str = OnMdt.join(MDT, OnMdt.mdt_id == MDT.id)\
        .join(UserPathway, MDT.pathway_id == UserPathway.pathway_id)\
        .select()\
        .where(
            OnMdt.id == int(id)
        ).where(
            UserPathway.user_id == context['request'].user.id
        ).distinct(UserPathway.user_id)\
        .execution_options(loader=OnMdt)

    if conn is None:
        async with db.acquire(reuse=False) as conn:
            on_mdt: OnMdt = await conn.one_or_none(query)
    else:
        on_mdt: OnMdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    if on_mdt.lock_user_id != context["request"].user.id\
            and reason is not None\
            and outcome is not None\
            and actioned is not None:
        raise OnMdtLockedByOtherUser()

    update_values = {}
    if reason is not None:
        update_values['reason'] = reason
    if outcome is not None:
        update_values['outcome'] = outcome
    if actioned is not None:
        update_values['actioned'] = actioned
    if order is not None:
        update_values['order'] = order

    if len(update_values.keys()) > 0:
        await on_mdt.update(**update_values).apply()

    return on_mdt
