from models import Role


async def create_role(name: str):
    """
    Creates a role in the local database.

    :param name: name of role to be created

    :return: Role

    :raise TypeError: argument invalid type
    """

    if name is None:
        raise TypeError("Argument name cannot be None type")

    return await Role.create(name=name)
