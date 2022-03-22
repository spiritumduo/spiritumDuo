from models import OnPathway
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from datetime import datetime, timedelta
from config import config
from common import DataCreatorInputErrors

@mutation.field("lockOnPathway")
@needsAuthorization(["authenticated"])
async def resolve_lock_on_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None
) -> OnPathway:
    errors: DataCreatorInputErrors = DataCreatorInputErrors()
    userId = int(info.context['request'].user.id)
    onPathwayId = int(input['onPathwayId'])
    unlock = ('unlock' in input and input['unlock']) or False
    pathway = await OnPathway.query.where(
        OnPathway.id == onPathwayId
    ).gino.one()

    if not unlock:
        if (
            pathway.lock_end_time is not None and
            pathway.lock_end_time > datetime.now() and
            pathway.lock_user_id != userId
        ):
            errors.addError(
                "lock_end_time",
                "A lock is already in place by another user!"
            )
            return errors

        await pathway.update(
            lock_user_id=userId,
            lock_end_time=(
                datetime.now() +
                timedelta(
                    seconds=int(config['DECISION_POINT_LOCKOUT_DURATION'])
                )
            )
        ).apply()
    else:
        if userId == pathway.lock_user_id:
            await pathway.update(
                lock_user_id=None,
                lock_end_time=None
            ).apply()
        else:
            errors.addError(
                "lock_user_id",
                "You cannot unlock a lock that belongs to you!"
            )
            return errors

    return pathway
