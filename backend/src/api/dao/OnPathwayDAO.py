from typing import Optional, List
from api.models import OnPathway, Patient, Pathway, DecisionPoint
# from api.dao.PatientDAO import PatientDAO
from dataclasses import dataclass
from promise import Promise
from promise.dataloader import DataLoader


@dataclass
class OnPathwayDAO:
    _OnPathway: OnPathway = None
    id: int = None
    is_discharged: bool = None
    awaiting_decision_type: DecisionPoint.DecisionPointType = None
    pathway: Pathway = None
    patient: Patient = None

    def __post_init__(self):
        if self._OnPathway is None:
            self._OnPathway = OnPathway()
        else:
            pass

    @classmethod
    def read(cls, searchId: int = None) -> Optional['OnPathwayDAO']:
        try:
            res = OnPathway.objects.get(pathway_id=searchId)
            return cls(
                _OnPathway=res,
                id=res.id,
                is_discharged=res.is_discharged,
                awaiting_decision_type=res.awaiting_decision_type,
                pathway=res.pathway,
                patient=res.patient
            )

        except OnPathway.DoesNotExist:
            return None

    @classmethod
    def readAllOnPathway(
            cls, pathwayId: int = None, filter: DecisionPoint.DecisionPointType = None
    ) -> List['OnPathwayDAO']:
        res = OnPathway.objects.filter(pathway_id=pathwayId, awaiting_decision_type=filter)
        onPathwayList: List['OnPathwayDAO'] = []
        for onPathway in res:
            dao = cls(
                _OnPathway=onPathway,
                id=onPathway.id,
                is_discharged=onPathway.is_discharged,
                awaiting_decision_type=onPathway.awaiting_decision_type,
                pathway=onPathway.pathway,
                patient=onPathway.patient
            )
            onPathwayList.append(dao)

        return onPathwayList

    def delete(self) -> None:
        self._OnPathway.delete()

    def save(self) -> None:
        self._OnPathway.is_discharged = self.is_discharged
        self._OnPathway.awaiting_decision_type = self.awaiting_decision_type
        self._OnPathway.pathway = self.pathway
        self._OnPathway.patient = self.patient
        self._OnPathway.save()
        self.id = self._OnPathway.id
