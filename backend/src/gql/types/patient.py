from typing import List
from ariadne.objects import ObjectType
from dataloaders import (
    OnPathwaysByPatient,
    PatientByHospitalNumberFromIELoader,
    OnMdtByIdLoader
)
from graphql.type import GraphQLResolveInfo
from models import Patient, MDT, OnMdt
from trustadapter.trustadapter import Patient_IE
from models.db import db


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
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.first_name


@PatientObjectType.field("lastName")
async def resolve_last_name(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.last_name


@PatientObjectType.field("communicationMethod")
async def resolve_communication_method(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.communication_method


@PatientObjectType.field("dateOfBirth")
async def resolve_date_of_birth(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.date_of_birth


@PatientObjectType.field("sex")
async def resolve_sex(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.sex


@PatientObjectType.field("occupation")
async def resolve_occupation(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.occupation


@PatientObjectType.field("telephoneNumber")
async def resolve_telephone_number(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.telephone_number


@PatientObjectType.field("address")
async def resolve_address(
    obj: Patient = None, info: GraphQLResolveInfo = None, *_
):
    record: Patient_IE = await PatientByHospitalNumberFromIELoader.\
        load_from_id(
            context=info.context, id=obj.hospital_number)
    return record.address


@PatientObjectType.field("onMdts")
async def resolve_mdt_clinicians(
    obj: Patient = None,
    info: GraphQLResolveInfo = None,
    id: int = None
):
    async with db.acquire(reuse=False) as conn:
        query: str = OnMdt.query.where(OnMdt.patient_id == obj.id)
        if id is not None:
            query = query.where(OnMdt.mdt_id == int(id))
        on_mdt_list: List[OnMdt] = await conn.all(query)
        for on_mdt in on_mdt_list:
            OnMdtByIdLoader.prime(
                context=info.context, key=on_mdt.id, value=on_mdt
            )
        return on_mdt_list
