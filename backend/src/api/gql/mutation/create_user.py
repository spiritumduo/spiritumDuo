from .mutation_type import mutation
from api.datacreation import CreateUser

@mutation.field("createUser")
async def resolve_create_user(_=None, into=None, input=None):
    newUser=await CreateUser(
        first_name=input["firstName"],
        last_name=input["lastName"],
        username=input["username"],
        password=input["password"],
        is_staff=input["isStaff"],
        is_superuser=input["isSuperuser"],

        department=input["department"]
    )
    return newUser