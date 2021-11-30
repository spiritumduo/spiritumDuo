from .query_type import query

@query.field("getPatient")
async def resolve_get_patient(obj=None, info=None, id=None):
    return {
        "id":id,
        "hospital_number":"MRN1234567",
        "national_number":"0123456789",
        "communication_method":"LETTER",
        "first_name":"JOHN",
        "last_name":"DOE",
        "date_of_birth":"2000-01-01",
    }