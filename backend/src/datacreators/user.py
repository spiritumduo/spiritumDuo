from models import User
from asyncpg.exceptions import UniqueViolationError
from bcrypt import hashpw, gensalt

async def CreateUser(
    username:str=None,
    password:str=None,
    first_name:str=None,
    last_name:str=None,
    department:str=None,
    default_pathway_id:int=None
):
    hashedPassword=hashpw(password.encode('utf-8'), gensalt())
    hashedPassword=hashedPassword.decode('utf-8')
    newUser:User=None
    default_pathway_id=int(default_pathway_id)
    try:
        newUser=await User.create(
            username=username,
            password=hashedPassword,
            first_name=first_name,
            last_name=last_name,
            department=department,
            default_pathway_id=default_pathway_id
        )
    except UniqueViolationError as e:
        return {
            "error":"An account with this username already exists!"
        }
    else:
        return {
            "id":newUser.id,
            "username":newUser.username,
            "first_name":newUser.first_name,
            "last_name":newUser.last_name,
            "department":newUser.department,
            "is_active":newUser.is_active,
            "default_pathway_id":newUser.default_pathway_id
        }
