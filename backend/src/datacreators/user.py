from models import User
from bcrypt import hashpw, gensalt

async def CreateUser(
    username:str=None,
    password:str=None,
    first_name:str=None,
    last_name:str=None,
    department:str=None,
    default_pathway_id:int=None
):
    class userOutput:
        def __init__(self, id:int=None,  username:str=None, first_name:str=None, last_name:str=None, department:str=None, default_pathway_id:int=None):
            self.id = id
            self.username = username
            self.first_name = first_name
            self.last_name = last_name
            self.department = department
            self.default_pathway_id = default_pathway_id

    hashedPassword=hashpw(password.encode('utf-8'), gensalt())
    hashedPassword=hashedPassword.decode('utf-8')
    default_pathway_id=int(default_pathway_id)
    newUser = await User.create(
        username=username,
        password=hashedPassword,
        first_name=first_name,
        last_name=last_name,
        department=department,
        default_pathway_id=default_pathway_id
    )
    return userOutput(
	    id=newUser.id,
        username=newUser.username,
        first_name=newUser.first_name, 
        last_name=newUser.last_name,
        department=newUser.department,
        default_pathway_id=newUser.default_pathway_id
    )
