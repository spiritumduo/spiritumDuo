from models import User
from bcrypt import hashpw, gensalt
from dataclasses import dataclass


async def CreateUser(
    username: str = None,
    password: str = None,
    email: str = None,
    first_name: str = None,
    last_name: str = None,
    department: str = None,
    default_pathway_id: int = None,
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
        default_pathway_id (int): ID of pathway user will log onto and see
        is_active (bool): active status of user
    Returns:
        User: newly created user object (without password)
    """

    @dataclass
    class userOutput:
        id: int = None,
        username: str = None,
        email: str = None,
        first_name: str = None,
        last_name: str = None,
        department: str = None,
        default_pathway_id: int = None,
        is_active: bool = None

    hashedPassword = hashpw(password.encode('utf-8'), gensalt())
    hashedPassword = hashedPassword.decode('utf-8')
    default_pathway_id = int(default_pathway_id)
    newUser = await User.create(
        username=username,
        password=hashedPassword,
        email=email,
        first_name=first_name,
        last_name=last_name,
        department=department,
        default_pathway_id=default_pathway_id,
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
