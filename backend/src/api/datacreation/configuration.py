from asgiref.sync import sync_to_async
from api.models import Configuration

@sync_to_async
def CreateConfiguration(
    hospital_number_name:str=None,
    hospital_number_regex:str=None,
    national_patient_number_name:str=None,
    national_patient_number_regex:str=None,
):
    try:
        config=Configuration(
            hospital_number_name=hospital_number_name,
            hospital_number_regex=hospital_number_regex,
            national_patient_number_name=national_patient_number_name,
            national_patient_number_regex=national_patient_number_regex,
        )
        config.save()
        return config
    except Exception as e:
        return False