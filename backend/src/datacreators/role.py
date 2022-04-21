from models import Role


async def create_role(name: str):
    return await Role.create(name=name)

