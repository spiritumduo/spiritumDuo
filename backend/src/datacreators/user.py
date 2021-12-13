from models import User
from asyncpg.exceptions import UniqueViolationError
from bcrypt import hashpw, gensalt

async def CreateUser(
    username:str=None,
    password:str=None,
    first_name:str=None,
    last_name:str=None,
    department:str=None
):
    hashedPassword=hashpw(password.encode('utf-8'), gensalt())
    hashedPassword=hashedPassword.decode('utf-8')
    newUser=None
    try:
        newUser=await User.create(
            username=username,
            password=hashedPassword,
            first_name=first_name,
            last_name=last_name,
            department=department,
            is_active=True
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
            "department":newUser.department,
            "isActive":newUser.is_active
        }