import graphene
from api.dao.RoleDAO import RoleDAO
from .types import RoleType, _InputRoleType

class CreateRole(graphene.Mutation): # Create class inheriting mutation class
    role=graphene.Field(RoleType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        roleInput=graphene.Argument(_InputRoleType)
    def mutate(self, info, roleInput): # function to handle mutation
        newRole=RoleDAO(
            name=roleInput.name, 
        )
        return CreateRole(role=newRole.save()) # return data