# Add a user for dev work
from starlette.responses import JSONResponse

from datacreators import CreateUser
from models import User


async def add_dev_user(request):
    users = await User.query.gino.all()
    user_num = str(len(users))
    username = "bob" + user_num
    password = "password" + user_num
    first_name = "John " + user_num
    last_name = "Doe " + user_num
    department = "Respiratory"

    user = await CreateUser(username, password, first_name, last_name, department)
    return JSONResponse(user)
