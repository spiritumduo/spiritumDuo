from asgiref.sync import sync_to_async
from api.models import TestResult, TestResultMedia
from typing import List
from api.models import Patient, PatientPathwayInstance

@sync_to_async
def CreateTestResult(
    patient:Patient=None,
    pathway_instance:PatientPathwayInstance=None,
    description:str=None,
    media_urls:List[str]=None
):
    try:
        testResult=TestResult(
            patient=patient,
            pathway_instance=pathway_instance,
            description=description,
        )
        testResult.save()
        for resource in media_urls:
            resource=TestResultMedia(
                test_result=testResult,
                resource=resource
            )
            resource.save()
        return testResult
    except Exception as e:
        print(e)
        return False