from api.common import db_sync_to_async
from api.models import TestResult, TestResultMedia, Patient, PatientPathwayInstance, Pathway
from typing import List
from api.models import Patient, PatientPathwayInstance

class ReferencedItemDoesNotExistError(Exception):
    """
        This occurs when a referenced item (patient, user, pathway)
        does not exist and cannot be found when it should
    """

@db_sync_to_async
def CreateTestResult(
    patient:int=None,
    pathway:int=None,
    description:str=None,
    media_urls:List[str]=None
):
    patientObject=None
    try:
        patientObject=Patient.objects.get(id=patient)
    except Patient.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: patient (id:"+str(patient)+")")

    pathwayObject=None
    try:
        pathwayObject=Pathway.objects.get(id=pathway)
    except Pathway.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: pathway (id:"+str(pathway)+")")

    patientPathwayInstanceObject=None
    try:
        patientPathwayInstanceObject=PatientPathwayInstance.objects.get(patient=patientObject, pathway=pathwayObject, is_discharged=False)
    except PatientPathwayInstance.DoesNotExist:
        raise ReferencedItemDoesNotExistError("referenced item does not exist: patient_pathway_instance (patient: "+str(patient)+"; pathway:"+str(pathway)+")")

    testResult=TestResult(
        patient=patientObject,
        patient_pathway_instance=patientPathwayInstanceObject,
        description=description,
    )
    testResult.save()
    for resource_path in media_urls:
        resource=TestResultMedia(
            test_result=testResult,
            resource_path=resource_path
        )
        resource.save()
    return testResult