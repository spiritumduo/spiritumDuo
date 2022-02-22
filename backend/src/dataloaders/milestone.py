from typing import List, Dict, Optional
from aiodataloader import DataLoader
from models import Milestone
from typing import Union

class MilestoneByDecisionPointLoader(DataLoader):
    """
        This is class for loading milestones using IDs from
        DecisionPoint and caching the result in the request context

        Attributes:
            loader_name (str): unique name of loader to cache data under
    """

    loader_name = "_milestone_by_decision_point_loader"
    _db = None

    def __init__(self, db):
        super().__init__()
        self._db = db

    @classmethod
    def _get_loader_from_context(cls, context) -> "MilestoneByDecisionPointLoader":
        if cls.loader_name not in context:
            context[cls.loader_name] = cls(db=context['db'])
        return context[cls.loader_name]

    async def fetch(self, keys) -> Dict[int, Milestone]:
        async with self._db.acquire(reuse=False) as conn:
            query = Milestone.query.where(Milestone.decision_point_id.in_(keys))
            result = await conn.all(query)

        returnData = {}
        for patient_milestone in result:
            returnData[patient_milestone.decision_point_id] = patient_milestone

        return returnData

    async def batch_load_fn(self, keys):
        fetchDict = await self.fetch([int(i) for i in keys])
        sortedData = []
        for key in keys:
            sortedData.append(fetchDict.get(int(key)))
        return sortedData

    @classmethod
    async def load_from_id(cls, context=None, id=None) -> Optional[Milestone]:
        """
            Load a single entry from its DecisionPoint ID
            
            Parameters:
                context (dict): request context
                id (int): ID to find
            Returns: 
                Milestone/None
        """
        if not id:
            return None
        return await cls._get_loader_from_context(context).load(id)

    @classmethod
    async def load_many_from_id(cls, context=None, ids=None) -> Optional[List[Milestone]]:
        """
            Loads multiple entries from their DecisionPoint IDs
            
            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
            Returns: 
                List[Milestone]/None
        """
        if not ids:
            return None
        return await cls._get_loader_from_context(context).load_many(ids)

    @classmethod
    def prime_with_context(cls, context=None, id=None, value=None) -> "MilestoneByDecisionPointLoader":
        return cls._get_loader_from_context(context).prime(id, value)

class MilestoneByOnPathway:
    """
        This is class for loading milestones and 
        caching the result in the request context

        Attributes:
            None
    """

    @staticmethod
    async def load_many_from_id(context=None, id=None, notOnDecisionPoint=None)->Union[List[Milestone], None]:
        """
            Load a multiple entries from their record ID
            
            Parameters:
                context (dict): request context
                id (List[int]): IDs to find
                notOnDecisionPoint (bool): this is a filter that will return
                    milestones based on whether they have a DecisionPoint ID set
            Returns: 
                List[Milestone]/None
        """

        if not context or not id:
            return None
        _gino=context['db']
        async with _gino.acquire(reuse=False) as conn:
            query=Milestone.query.where(Milestone.on_pathway_id==id)
            if notOnDecisionPoint: query=query.where(Milestone.decision_point_id.is_(None))
            milestones=await conn.all(query)

        if MilestoneByDecisionPointLoader.loader_name not in context:
            context[MilestoneByDecisionPointLoader.loader_name]=MilestoneByDecisionPointLoader(db=context['db'])
        for milestone in milestones:
            context[MilestoneByDecisionPointLoader.loader_name].prime(milestone.id, milestone)
        return milestones