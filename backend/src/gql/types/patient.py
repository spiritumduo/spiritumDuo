from ariadne.objects import ObjectType
from dataloaders import OnPathwaysByPatient, PatientByHospitalNumberFromIELoader
from graphql.type import GraphQLResolveInfo
from models import Patient
from trustadapter.trustadapter import Patient_IE

PatientObjectType=ObjectType("Patient")
@PatientObjectType.field("onPathways")    
async def resolve_patient_pathways(
    obj:Patient=None, 
    info:GraphQLResolveInfo=None, 
    pathwayId:int=None, 
    isDischarged:bool=False, 
    awaitingDecisionType=None, 
    limit:int=None, 
):
    return await OnPathwaysByPatient.load_from_id(
        context=info.context, 
        id=obj.id, 
        pathwayId=pathwayId, 
        isDischarged=isDischarged, 
        awaitingDecisionType=awaitingDecisionType, 
        limit=limit
    )

@PatientObjectType.field("firstName")
async def resolver(obj:Patient=None, info:GraphQLResolveInfo=None, *_):
    record:Patient_IE=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.first_name

@PatientObjectType.field("lastName")
async def resolver(obj:Patient=None, info:GraphQLResolveInfo=None, *_):
    record:Patient_IE=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.last_name

@PatientObjectType.field("communicationMethod")
async def resolver(obj:Patient=None, info:GraphQLResolveInfo=None, *_):
    record:Patient_IE=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.communication_method

@PatientObjectType.field("dateOfBirth")
async def resolver(obj:Patient=None, info:GraphQLResolveInfo=None, *_):
    record:Patient_IE=await PatientByHospitalNumberFromIELoader.load_from_id(context=info.context, id=obj.hospital_number)
    return record.date_of_birth
