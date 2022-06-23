from typing import List
from ariadne.objects import ObjectType
from dataloaders import (
    UserByIdLoader,
    PathwayByIdLoader
)
from graphql.type import GraphQLResolveInfo
from models import MDT, Patient, PatientMDT
from models.db import db

MDTObjectType = ObjectType("MDT")


@MDTObjectType.field("creator")
async def resolve_mdt_creator(
    obj: MDT = None,
    info: GraphQLResolveInfo = None,
):
    return await UserByIdLoader.load_from_id(
        context=info.context,
        id=obj.creator_user_id
    )


@MDTObjectType.field("pathway")
async def resolve_mdt_pathway(
    obj: MDT = None,
    info: GraphQLResolveInfo = None,
):
    return await PathwayByIdLoader.load_from_id(
        context=info.context,
        id=obj.pathway_id
    )


@MDTObjectType.field("patients")
async def resolve_mdt_patients(
    obj: MDT = None,
    info: GraphQLResolveInfo = None,
):
    async with db.acquire(reuse=False) as conn:
        patients: List[Patient] = await conn.all(
            Patient.join(PatientMDT).select()
            .where(PatientMDT.mdt_id == obj.id)
        )
        return patients
