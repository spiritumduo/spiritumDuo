from typing import Union
from SdTypes import Permissions
from models import MDT, db, OnMdt, UserMDT
from .mutation_type import mutation
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo


@mutation.field("deleteMdt")
@needsAuthorization([Permissions.MDT_DELETE, Permissions.MDT_UPDATE])
async def resolve_delete_mdt(
    obj=None,
    info: GraphQLResolveInfo = None,
    input: dict = None,
) -> bool:
    mdt_id: int = int(input['id'])
    migrating_mdt_id: Union[int, None] = (
        int(input['movePatientsToMdtId'])
        if 'movePatientsToMdtId' in input else None
    )
    async with db.transaction():
        if migrating_mdt_id is not None:
            await OnMdt.update.values(mdt_id=migrating_mdt_id).where(
                OnMdt.mdt_id == mdt_id
            ).gino.status()
        await UserMDT.delete.where(UserMDT.mdt_id == mdt_id).gino.status()
        await MDT.delete.where(MDT.id == mdt_id).gino.status()

    return True
