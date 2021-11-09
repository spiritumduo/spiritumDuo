import graphene
from api.dao.PathwayDAO import PathwayDAO
from .types import PathwayType, _InputPathwayType

class CreatePathway(graphene.Mutation): # Create class inheriting mutation class
    pathway=graphene.Field(PathwayType) # Define base return data of mutation
    class Arguments: # arguments the function can take
        input=graphene.Argument(_InputPathwayType)
    def mutate(self, info, input): # function to handle mutation
        pathway=PathwayDAO(
            name=input.name, 
        )
        pathway.save()
        return CreatePathway(pathway=pathway) # return data