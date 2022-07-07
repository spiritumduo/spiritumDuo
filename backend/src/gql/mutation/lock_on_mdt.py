from typing import Union
from models import UserPathway, OnMdt, MDT, db
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from datetime import datetime, timedelta
from config import config
from common import DataCreatorInputErrors
from SdTypes import Permissions


@mutation.field("lockOnMdt")
@needsAuthorization(
    [Permissions.ON_MDT_UPDATE, Permissions.ON_MDT_READ])
async def resolve_lock_on_mdt(
    obj: OnMdt = None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
) -> Union[OnMdt, DataCreatorInputErrors]:
    errors: DataCreatorInputErrors = DataCreatorInputErrors()
    userId: int = int(info.context['request'].user.id)
    unlock: bool = ('unlock' in input and input['unlock']) or False

    query: str = OnMdt.join(MDT, OnMdt.mdt_id == MDT.id)\
        .join(UserPathway, MDT.pathway_id == UserPathway.pathway_id)\
        .select()\
        .where(
            OnMdt.id == int(input['id'])
        ).where(
            UserPathway.user_id == userId
        ).distinct(UserPathway.user_id)\
        .execution_options(loader=OnMdt)

    async with db.acquire(reuse=False) as conn:
        on_mdt: OnMdt = await conn.one_or_none(query)

    if on_mdt is None:
        raise PermissionError()

    if unlock:
        if userId == on_mdt.lock_user_id:
            await on_mdt.update(
                lock_user_id=None,
                lock_end_time=None
            ).apply()
        else:
            errors.addError(
                'lock_user_id',
                'You cannot unlock a lock that doesn\'t belong to you!'
            )
    else:
        if (
            on_mdt.lock_end_time is not None and
            on_mdt.lock_end_time > datetime.now() and
            on_mdt.lock_user_id != userId
        ):
            errors.addError(
                "lock_end_time",
                "A lock is already in place by another user!"
            )
        else:
            await on_mdt.update(
                lock_user_id=userId,
                lock_end_time=(
                    datetime.now() +
                    timedelta(
                        seconds=int(config['ON_MDT_EDIT_LOCKOUT_DURATION'])
                    )
                )
            ).apply()
    return {
        "on_mdt": on_mdt,
        "user_errors": errors.errorList if len(errors.errorList) > 0 else None
    }
