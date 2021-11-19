from asgiref.sync import sync_to_async
from api.models import Pathway

@sync_to_async
def CreatePathway(
    name:str=None,
):
    try:
        pathway=Pathway(
            name=name,
        )
        pathway.save()
        return pathway
    except Exception as e:
        return False