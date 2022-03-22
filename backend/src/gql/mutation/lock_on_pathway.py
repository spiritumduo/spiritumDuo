from models import OnPathway
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from datetime import datetime, timedelta
from config import config


@mutation.field("lockOnPathway")
@needsAuthorization(["authenticated"])
async def resolve_lock_on_pathway(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None
) -> OnPathway:
    userId = int(info.context['request'].user.id)
    onPathwayId = int(input['onPathwayId'])
    unlock = ('unlock' in input and input['unlock']) or False
    pathway = await OnPathway.query.where(
        OnPathway.id == onPathwayId
    ).gino.one()

    if not unlock:
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
        await pathway.update(
            lock_user_id=None,
            lock_end_time=None
        ).apply()

    return await OnPathway.query.where(
        OnPathway.id == onPathwayId
    ).gino.one()