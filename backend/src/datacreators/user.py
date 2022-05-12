from models import User
from bcrypt import hashpw, gensalt
from dataclasses import dataclass


@dataclass
class userOutput:
    id: int = None,
    username: str = None,
    email: str = None,
    first_name: str = None,
    last_name: str = None,
    department: str = None,
    default_pathway_id: int = None,
    is_active: bool = None,


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
    Creates a patient object in local and external databases

    Keyword arguments:
        username (str): User's username
        password (str): User's plaintext password
        email (str): User's email address
        first_name (str): User's first name
        last_name (str): User's last name
        department (str): User's department
        is_active (bool): active status of user
    Returns:
        User: newly created user object (without password)
    """

    hashedPassword = hashpw(password.encode('utf-8'), gensalt())
    hashedPassword = hashedPassword.decode('utf-8')

    newUser = await User.create(
        username=username,
        password=hashedPassword,
        email=email,
        first_name=first_name,
        last_name=last_name,
        department=department,
        is_active=is_active
    )

    return userOutput(
        id=newUser.id,
        username=newUser.username,
        email=newUser.email,
        first_name=newUser.first_name,
        last_name=newUser.last_name,
        department=newUser.department,
        default_pathway_id=newUser.default_pathway_id,
        is_active=newUser.is_active
    )
