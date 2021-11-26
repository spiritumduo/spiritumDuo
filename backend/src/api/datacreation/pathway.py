from api.common import db_sync_to_async
from api.models import Pathway

@db_sync_to_async
def CreatePathway(
    name:str=None,
):
    try:
        Pathway.objects.get(name=name)
    except Pathway.DoesNotExist:
        pass
    else:
        return{
            "userError":{
                "field":"name",
                "message":"A pathway with this name already exists!"
            }
        }
    pathway=Pathway(
        name=name,
    )
    pathway.save()
    return {
        "pathway":pathway
    }