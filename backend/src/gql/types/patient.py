from ariadne.objects import ObjectType
from dataloaders import (
    OnPathwaysByPatient,
    PatientByHospitalNumberFromIELoader
)
from graphql.type import GraphQLResolveInfo
from models import Patient
from trustadapter.trustadapter import Patient_IE

PatientObjectType = ObjectType("Patient")


@PatientObjectType.field("onPathways")
async def resolve_patient_pathways(
    obj: Patient = None,
    info: GraphQLResolveInfo = None,
    pathwayId: int = None,
    includeDischarged: bool = False,
    awaitingDecisionType=None,
    limit: int = None,
):
    return await OnPathwaysByPatient.load_from_id(
        context=info.context,
        id=obj.id,
        pathwayId=pathwayId,
        includeDischarged=includeDischarged,
        awaitingDecisionType=awaitingDecisionType,
        limit=limit
    )


@PatientObjectType.field("firstName")
async def resolve_first_name(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.load_from_id(
        context=info.context, id=obj.hospital_number)
    return record.first_name


@PatientObjectType.field("lastName")
async def resolve_last_name(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.load_from_id(
        context=info.context, id=obj.hospital_number)
    return record.last_name


@PatientObjectType.field("communicationMethod")
async def resolve_communication_method(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.load_from_id(
        context=info.context, id=obj.hospital_number)
    return record.communication_method


@PatientObjectType.field("dateOfBirth")
async def resolve_date_of_birth(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.load_from_id(
        context=info.context, id=obj.hospital_number)
    return record.date_of_birth


@PatientObjectType.field("sex")
async def resolve_sex(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.load_from_id(
        context=info.context, id=obj.hospital_number)
    return record.sex
