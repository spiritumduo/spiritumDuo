from api.common import database_sync_to_async
from api.models import TestResult, TestResultMedia
from typing import List
from api.models import Patient, PatientPathwayInstance

@database_sync_to_async
def CreateTestResult(
    patient:Patient=None,
    patient_pathway_instance:PatientPathwayInstance=None,
    description:str=None,
    media_urls:List[str]=None
):
    try:
        testResult=TestResult(
            patient=patient,
            patient_pathway_instance=patient_pathway_instance,
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
    except Exception as e:
        print(e)
        return False