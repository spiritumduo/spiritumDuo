from sqlalchemy import and_
from typing import Dict, List, Set
from models import Pathway, PathwayClinicalRequestType
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError


async def UpdatePathway(
    context: dict = None,
    id: int = None,
    name: str = None,
    clinical_request_types: List[Dict[str, int]] = None,
    userErrors: DataCreatorInputErrors = None
):
    userErrors = DataCreatorInputErrors()
    if id is None:
        raise ReferencedItemDoesNotExistError("ID not provided")
    elif name is None:
        raise ReferencedItemDoesNotExistError("Name not provided")
    elif context is None:
        raise ReferencedItemDoesNotExistError("Context not provided")

    try:
        pathway: Pathway = await Pathway.get(int(id))
        await pathway.update(name=name).apply()
    except UniqueViolationError:
        userErrors.addError("Name", "A pathway with this name already exists")
        return userErrors

    current_clinical_request_types = await PathwayClinicalRequestType.query.where(
        PathwayClinicalRequestType.pathway_id == int(id)).gino.all()

    current_clinical_request_type_ids: Set[int] = set([int(mT.clinical_request_type_id) for mT in current_clinical_request_types])

    input_clinical_request_type_ids: Set[int] = set([int(mT['id']) for mT in clinical_request_types]) if clinical_request_types else set()

    toRemove = current_clinical_request_type_ids - input_clinical_request_type_ids
    toAdd = input_clinical_request_type_ids - current_clinical_request_type_ids

    await PathwayClinicalRequestType.delete.where(
        and_(
            PathwayClinicalRequestType.clinical_request_type_id.in_(toRemove),
            PathwayClinicalRequestType.pathway_id == int(id)
        )
    ).gino.status()

    for mT_ID in toAdd:
        await PathwayClinicalRequestType.create(
            pathway_id=int(id),
            clinical_request_type_id=mT_ID
        )

    return pathway
