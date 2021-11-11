import graphene
from api.dao.PathwayDAO import PathwayDAO
from .types import PathwayType, _InputPathwayType

class CreatePathway(graphene.Mutation): # Create class inheriting mutation class
    data=graphene.Field(PathwayType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        input=graphene.Argument(_InputPathwayType, required=True)
    def mutate(self, info, input): # function to handle mutation
        pathway=PathwayDAO(
            name=input.name, 
            type=input.type,
            is_discharged=input.is_discharged
        )
        pathway.save()
        return CreatePathway(data=pathway) # return data