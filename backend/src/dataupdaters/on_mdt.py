from datetime import datetime
from SdTypes import ClinicalRequestState
from common import ReferencedItemDoesNotExistError
from models import MDT, OnMdt, UserPathway, ClinicalRequest
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
    completed: bool = None,
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
        on_mdt: OnMdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    if on_mdt.lock_user_id != context["request"].user.id:
        raise OnMdtLockedByOtherUser()

    if outcome is not None:
        await on_mdt.update(reason=reason, outcome=outcome).apply()
    else:
        await on_mdt.update(reason=reason).apply()

    if completed is not None:
        clinical_request_id = on_mdt.clinical_request_id

        clinical_request: ClinicalRequest = await ClinicalRequest.get(
            int(clinical_request_id)
        )

        if completed is True:

            await clinical_request.update(
                current_state=ClinicalRequestState.COMPLETED,
                completed_at=datetime.now()
            ).apply()
        else:
            await clinical_request.update(
                current_state=ClinicalRequestState.WAITING,
                completed_at=None
            ).apply()

    return on_mdt
