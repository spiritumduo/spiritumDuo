from common import MutationUserErrorHandler, OnMdtPayload
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
    order: int = None,
    conn: GinoConnection = None,
):
    """
    Updates a given OnMDT object
    
    :param context: request context
    :param id: id of OnMDT object
    :param reason: reason pt added to MDT
    :param outcome: outcome of MDT
    :param order: order of MDT on list
    :param conn: database connection/Gino object

    :return OnMdtPayload:

    :raise TypeError:
    """
    errors = MutationUserErrorHandler()

    if id is None:
        raise TypeError("ID is None")
    elif context is None:
        raise TypeError("Context not provided")

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
            and (reason is not None or outcome is not None):
        errors.addError(
            'lock_user_id',
            'This is locked by another user'
        )
        return OnMdtPayload(user_errors=errors.errorList)

    update_values = {}
    if reason is not None:
        update_values['reason'] = reason
    if outcome is not None:
        update_values['outcome'] = outcome
    if order is not None:
        update_values['order'] = order

    if len(update_values.keys()) > 0:
        await on_mdt.update(**update_values).apply()

    return OnMdtPayload(on_mdt=on_mdt)
