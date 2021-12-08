from models import User
from asyncpg.exceptions import UniqueViolationError

async def CreateUser(
    username:str=None,
    password:str=None,
    first_name:str=None,
    last_name:str=None,
    department:str=None
):
    """
    - password hashing
    - session handling
    """
    newUser=None
    try:
        newUser=await User.create(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            department=department
        )
    except UniqueViolationError as e:
        return {
            "error":"An account with this username already exists!"
        }
    else:
        return{
            "username":newUser.username,
            "firstName":newUser.first_name,
            "lastName":newUser.last_name,
            "department":newUser.department
        }