import re
from ariadne.objects import ObjectType
from models import OnMdt
from dataloaders import (
    PatientByIdLoader,
    UserByIdLoader,
    MdtByIdLoader,
    ClinicalRequestByIdLoader
)
from graphql.type import GraphQLResolveInfo

OnMdtObjectType = ObjectType("OnMdt")


@OnMdtObjectType.field("patient")
async def resolve_on_mdt_patient(
    obj: OnMdt = None, info: GraphQLResolveInfo = None, *_
):
    return await PatientByIdLoader.load_from_id(
        context=info.context, id=obj.patient_id)


@OnMdtObjectType.field("clinician")
async def resolve_on_mdt_clinician(
    obj: OnMdt = None, info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context, id=obj.user_id)


@OnMdtObjectType.field("mdt")
async def resolve_on_mdt_mdt(
    obj: OnMdt = None, info: GraphQLResolveInfo = None, *_
):
    return await MdtByIdLoader.load_from_id(
        context=info.context, id=obj.mdt_id)


@OnMdtObjectType.field("lockUser")
async def resolve_on_mdt_lock_user(
    obj: OnMdt = None, info: GraphQLResolveInfo = None, *_
):
    return await UserByIdLoader.load_from_id(
        context=info.context, id=obj.lock_user_id)

@OnMdtObjectType.field("clinicalRequest")
async def resolve_clinical_request(
    obj: OnMdt = None, info: GraphQLResolveInfo = None, *_
):
    return await ClinicalRequestByIdLoader.load_from_id(
        context=info.context, id=obj.clinical_request_id)
