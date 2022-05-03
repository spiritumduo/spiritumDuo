from sqlalchemy import and_
from typing import Dict, List, Set
from models import Pathway, PathwayMilestoneType
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError


async def UpdatePathway(
    context: dict = None,
    id: int = None,
    name: str = None,
    milestone_types: List[Dict[str, int]] = None,
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

    current_milestone_types = await PathwayMilestoneType.query.where(
        PathwayMilestoneType.pathway_id == int(id)).gino.all()

    current_milestone_type_ids: Set[int] = set([int(mT.milestone_type_id) for mT in current_milestone_types])

    input_milestone_type_ids: Set[int] = set([int(mT['id']) for mT in milestone_types]) if milestone_types else set()

    toRemove = current_milestone_type_ids - input_milestone_type_ids
    toAdd = input_milestone_type_ids - current_milestone_type_ids

    await PathwayMilestoneType.delete.where(
        and_(
            PathwayMilestoneType.milestone_type_id.in_(toRemove),
            PathwayMilestoneType.pathway_id == int(id)
        )
    ).gino.status()

    for mT_ID in toAdd:
        await PathwayMilestoneType.create(
            pathway_id=int(id),
            milestone_type_id=mT_ID
        )

    return pathway
