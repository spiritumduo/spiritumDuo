from sqlalchemy import and_
from typing import Dict, List, Set
from models import Pathway, PathwayClinicalRequestType
from common import MutationUserErrorHandler, PathwayPayload
from asyncpg.exceptions import UniqueViolationError


async def UpdatePathway(
    context: dict = None,
    id: int = None,
    name: str = None,
    clinical_request_types: List[Dict[str, int]] = None,
):
    """
    Updates given pathway
    :param context: request context
    :param id: id of Pathway object
    :param name: name of pathway
    :param clinical_request_types: request types allowed on Pathway

    :return PathwayPayload:

    :raise TypeError:
    """
    userErrors = MutationUserErrorHandler()
    if id is None:
        raise TypeError("id cannot be none type")
    elif name is None:
        raise TypeError("name cannot be none type")
    elif context is None:
        raise TypeError("context cannot be none type")

    try:
        pathway: Pathway = await Pathway.get(int(id))
        await pathway.update(name=name).apply()
    except UniqueViolationError:
        userErrors.addError("Name", "A pathway with this name already exists")
        return PathwayPayload(user_errors=userErrors.errorList)

    current_clinical_request_types = await PathwayClinicalRequestType.query\
        .where(PathwayClinicalRequestType.pathway_id == int(id)).gino.all()

    current_clinical_request_type_ids: Set[int] = set(
        [int(
            mT.clinical_request_type_id
        ) for mT in current_clinical_request_types]
    )

    input_clinical_request_type_ids: Set[int] = set(
        [int(mT['id']) for mT in clinical_request_types]
    ) if clinical_request_types else set()

    toRemove = current_clinical_request_type_ids - \
        input_clinical_request_type_ids
    toAdd = input_clinical_request_type_ids - \
        current_clinical_request_type_ids

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

    return PathwayPayload(pathway=pathway)
