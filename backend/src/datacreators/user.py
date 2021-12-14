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
    newUser:User=None
    try:
        newUser=await User.create(
            username=username,
            password=hashedPassword,
            first_name=first_name,
            last_name=last_name,
            department=department
        )
    except UniqueViolationError as e:
        return {
            "error":"An account with this username already exists!"
        }
    else:
        return newUser
