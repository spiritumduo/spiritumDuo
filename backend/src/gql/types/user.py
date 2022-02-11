from ariadne.objects import ObjectType
from dataloaders import PathwayByIdLoader
from models import User

UserObjectType=ObjectType("User")

@UserObjectType.field("defaultPathway")
async def resolver(obj:User=None, info=None, *_):
    return await PathwayByIdLoader.load_from_id(context=info.context, id=obj.default_pathway_id)