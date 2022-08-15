from models import Role


async def create_role(name: str):
    """
    Creates a role in the local database.
    This is designed for the RESTful API.

    Keyword arguments:
        name (str): name of role to be created

    Returns:
        Role: new Role object

    """
    return await Role.create(name=name)
