import graphene
from api.dao.RoleDAO import RoleDAO
from .types import RoleType, _InputRoleType

class CreateRole(graphene.Mutation): # Create class inheriting mutation class
    data=graphene.Field(RoleType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        input=graphene.Argument(_InputRoleType)
    def mutate(self, info, input): # function to handle mutation
        role=RoleDAO(
            name=input.name, 
        )
        role.save()
        return CreateRole(data=role) # return data