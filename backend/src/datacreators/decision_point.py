from models import DecisionPoint
from gettext import gettext as _
from SdTypes import DecisionTypes

class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item does not 
        exist and cannot be found when it should
    """
async def CreateDecisionPoint(
    context:dict=None, 
    on_pathway_id:int=None,
    clinician_id:int=None,
    decision_type:DecisionTypes=None,
    clinic_history:str=None,
    comorbidities:str=None,
):
    if context is None:
        raise ReferencedItemDoesNotExistError("Context is not provided")

    _decisionPoint=await DecisionPoint.create(
        on_pathway_id=int(on_pathway_id),
        clinician_id=int(clinician_id),
        decision_type=decision_type,
        clinic_history=clinic_history,
        comorbidities=comorbidities,
    )

    return {
        "decisionPoint":_decisionPoint
    }