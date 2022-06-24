from ariadne.objects import ObjectType
from models import OnMdt
from dataloaders import (
    PatientByIdLoader,
    UserByIdLoader,
    MdtByIdLoader
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
