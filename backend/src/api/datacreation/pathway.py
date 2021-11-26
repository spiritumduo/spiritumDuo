from api.common import db_sync_to_async
from api.models import Pathway

@db_sync_to_async
def CreatePathway(
    name:str=None,
):
    userErrors=[]
    try:
        Pathway.objects.get(name=name)
    except Pathway.DoesNotExist:
        pass
    else:
        userErrors.append(
            {
                "field":"name",
                "message":"A pathway with this name already exists!"
            }
        )
        return {
            "userErrors":userErrors
        }
    pathway=Pathway(
        name=name,
    )
    pathway.save()
    return {
        "pathway":pathway
    }