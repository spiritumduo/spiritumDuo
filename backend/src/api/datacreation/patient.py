from asgiref.sync import sync_to_async
from api.models import Patient
from datetime import date

@sync_to_async
def CreatePatient(
    first_name:str=None,
    last_name:str=None,
    communication_method:str=None,
    hospital_number:int=None,
    national_number:int=None,
    date_of_birth:date=None,
):
    try:
        patient=Patient(
            first_name=first_name,
            last_name=last_name,
            communication_method=communication_method,
            hospital_number=hospital_number,
            national_number=national_number,
            date_of_birth=date_of_birth,
        )
        patient.save()
        return patient
    except Exception as e:
        return False