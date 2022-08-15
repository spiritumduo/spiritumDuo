from models import User
from bcrypt import hashpw, gensalt
from common import SafeUser


async def CreateUser(
    username: str = None,
    password: str = None,
    email: str = None,
    first_name: str = None,
    last_name: str = None,
    department: str = None,
    is_active: bool = None
):
    """
    Creates a user object.
    This is designed for the RESTful API.

    Keyword arguments:
        username (str): User's username
        password (str): User's plaintext password
        email (str): User's email address
        first_name (str): User's first name
        last_name (str): User's last name
        department (str): User's department
        is_active (bool): active status of user
    Returns:
        SafeUser: contains data from new User
            object without password
    """

    hashedPassword = hashpw(password.encode('utf-8'), gensalt())
    hashedPassword = hashedPassword.decode('utf-8')

    user: User = await User.create(
        username=username.lower(),
        password=hashedPassword,
        email=email,
        first_name=first_name,
        last_name=last_name,
        department=department,
        is_active=is_active
    )

    # returns SafeUser as it doesn't contain password
    return SafeUser(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        department=user.department,
        default_pathway_id=user.default_pathway_id,
        is_active=user.is_active
    )
