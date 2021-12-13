from .mutation_type import mutation
from models.User import User


@mutation.field("login")
async def resolve_login(_=None, info=None, username=None, password=None):
    user = await User.get(1)
    if user is None:
        return None

    return user
