from asgiref.sync import sync_to_async
from api.models import TestResult
from datetime import date
from api.models import Patient, PatientPathwayInstance

@sync_to_async
def CreateTestResult(
    patient:Patient=None,
    pathway_instance:PatientPathwayInstance=None,
    description:str=None,
    media_urls:str=None
):
    try:
        testResult=TestResult(
            patient=patient,
            pathway_instance=pathway_instance,
            description=description,
            media_urls=media_urls
        )
        testResult.save()
        return testResult
    except Exception as e:
        print(e)
        return False