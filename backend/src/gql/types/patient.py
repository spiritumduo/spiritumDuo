from ariadne.objects import ObjectType
from dataloaders import OnPathwaysByPatient, PatientByHospitalNumberFromIELoader

PatientObjectType=ObjectType("Patient")

@PatientObjectType.field("onPathways")    
async def resolve_patient_pathways(obj=None, info=None, pathwayId=None, isDischarged=False, awaitingDecisionType=None, limit=None, *_):
    # TODO: add support for search parameters
    return await OnPathwaysByPatient.load_from_id(context=info.context, id=obj.id)



@PatientObjectType.field("firstName")
async def resolver(obj=None, info=None, *_):
    record=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.first_name

@PatientObjectType.field("lastName")
async def resolver(obj=None, info=None, *_):
    record=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.last_name

@PatientObjectType.field("communicationMethod")
async def resolver(obj=None, info=None, *_):
    record=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.communication_method