from ctypes import Union
from containers import SDContainer
from dependency_injector.wiring import Provide, inject
from models import OnPathway, UserPathways
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from datetime import datetime, timedelta
from config import config
from common import DataCreatorInputErrors, UserDoesNotHavePathwayPermission
from SdTypes import Permissions


@mutation.field("lockOnPathway")
@needsAuthorization(
    [Permissions.ON_PATHWAY_UPDATE, Permissions.ON_PATHWAY_READ])
@inject
async def resolve_lock_on_pathway(
    obj: OnPathway = None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
    pub=Provide[SDContainer.pubsub_service]
) -> OnPathway:
    errors: DataCreatorInputErrors = DataCreatorInputErrors()
    userId = int(info.context['request'].user.id)
    onPathwayId = int(input['onPathwayId'])
    unlock = ('unlock' in input and input['unlock']) or False

    onPathway: OnPathway = await OnPathway.query.where(
        OnPathway.id == onPathwayId
    ).gino.one()

    userHasPathwayPermission: Union[UserPathways, None] = await UserPathways\
        .query.where(UserPathways.user_id == userId)\
        .where(UserPathways.pathway_id == onPathway.pathway_id)\
        .gino.one_or_none()

    if userHasPathwayPermission is None:
        raise UserDoesNotHavePathwayPermission(
            f"User ID: {userId}"
            f"; Pathway ID: {onPathway.pathway_id}"
        )

    if unlock:
        if userId == onPathway.lock_user_id:
            await onPathway.update(
                lock_user_id=None,
                lock_end_time=None
            ).apply()
        else:
            errors.addError(
                "lock_user_id",
                "You cannot unlock a lock that doesn't belong to you!"
            )
    else:
        if (
            onPathway.lock_end_time is not None and
            onPathway.lock_end_time > datetime.now() and
            onPathway.lock_user_id != userId
        ):
            errors.addError(
                "lock_end_time",
                "A lock is already in place by another user!"
            )
        else:
            await onPathway.update(
                lock_user_id=userId,
                lock_end_time=(
                    datetime.now() +
                    timedelta(
                        seconds=int(config['DECISION_POINT_LOCKOUT_DURATION'])
                    )
                )
            ).apply()

    returnErrors = None
    if errors.hasErrors():
        returnErrors = errors.errorList

    await pub.publish(
        'on-pathway-updated',
        await OnPathway.get(int(input["onPathwayId"]))
    )

    return {
        "onPathway": onPathway,
        "userErrors": returnErrors
    }
