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

    :param username: User's username
    :param password: User's plaintext password
    :param email: User's email address
    :param first_name: User's first name
    :param last_name: User's last name
    :param department: User's department
    :param is_active: active status of user

    :return: SafeUser

    :raise TypeError: invalid parameter type
    """

    if username is None:
        raise TypeError("parameters username cannot be None type")
    if password is None:
        raise TypeError("parameters password cannot be None type")
    if email is None:
        raise TypeError("parameters email cannot be None type")
    if first_name is None:
        raise TypeError("parameters first_name cannot be None type")
    if last_name is None:
        raise TypeError("parameters last_name cannot be None type")
    if department is None:
        raise TypeError("parameters department cannot be None type")
    if is_active is None:
        raise TypeError("parameters is_active cannot be None type")

    hashed_password = hashpw(password.encode('utf-8'), gensalt())
    hashed_password = hashed_password.decode('utf-8')

    user: User = await User.create(
        username=username.lower(),
        password=hashed_password,
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
