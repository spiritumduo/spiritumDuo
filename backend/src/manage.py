import asyncio
import sys
from operator import and_
import argparse
from models import (
    Pathway,
    Patient,
    DecisionPoint,
    ClinicalRequest,
    ClinicalRequestType,
    User,
    Session,
    OnPathway,
    Role,
    RolePermission, UserRole,
    PathwayClinicalRequestType,
    UserPathway,
    MDT,
    OnMdt,
    UserMDT
)
from containers import SDContainer
from asyncpg.exceptions import UndefinedTableError
from models.db import db, DATABASE_URL
from api import app
from faker import Faker
from random import getrandbits
from itsdangerous import TimestampSigner
from trustadapter.trustadapter import (
    TrustIntegrationCommunicationError,
    PseudoTrustAdapter
)
from config import config
from base64 import b64encode

from demo_datasets.demo import insert_demo_data
from demo_datasets.bulk import insert_bulk_data
from demo_datasets.two_pathways import insert_two_pathways_data

faker = Faker(['en_GB'])
app.container = SDContainer()

NUMBER_OF_USERS_PER_PATHWAY = 5
NUMBER_OF_PATHWAYS = 20
NUMBER_OF_PATIENTS_PER_PATHWAY = 5


class RequestPlaceholder(dict):
    """
    This is a test
    """


_CONTEXT = {
    "db": db,
    "request": RequestPlaceholder()
}

signer = TimestampSigner(config['SESSION_SECRET_KEY'])
random_cookie_value = b64encode(str(getrandbits(64)).encode("utf-8"))
SESSION_COOKIE = signer.sign(random_cookie_value).decode("utf-8")

_CONTEXT['request'].cookies = {
    "SDSESSION": SESSION_COOKIE
}


async def check_connection():
    print("Testing connection...")
    try:
        await PseudoTrustAdapter().test_connection(
            auth_token=_CONTEXT['request'].cookies['SDSESSION']
        )
    except TrustIntegrationCommunicationError as e:
        print(e)
        print("Connection failed!")
        sys.exit(1)
    else:
        print("Connection successful!")


async def clear_existing_data():
    print("Clearing existing data from pseudotie database")
    await PseudoTrustAdapter().clear_database(
        auth_token=_CONTEXT['request'].cookies['SDSESSION']
    )

    print("Clearing existing data from local database")

    try:
        await OnMdt.delete.gino.status()
        print("Table `OnMdt` deleted")
    except UndefinedTableError:
        print("Table `OnMdt` not found. Continuing")

    try:
        await UserMDT.delete.gino.status()
        print("Table `UserMDT` deleted")
    except UndefinedTableError:
        print("Table `UserMDT` not found. Continuing")

    try:
        await MDT.delete.gino.status()
        print("Table `MDT` deleted")
    except UndefinedTableError:
        print("Table `MDT` not found. Continuing")

    try:
        await UserRole.delete.gino.status()
        print("Table `UserRole` deleted")
    except UndefinedTableError:
        print("Table `UserRole` not found. Continuing")

    try:
        await RolePermission.delete.gino.status()
        print("Table `RolePermission` deleted")
    except UndefinedTableError:
        print("Table `RolePermission` not found. Continuing")

    try:
        await Role.delete.gino.status()
        print("Table `Role` deleted")
    except UndefinedTableError:
        print("Table `delete` not found. Continuing")

    try:
        await ClinicalRequest.delete.where(
            ClinicalRequest.id >= 0).gino.status()
        print("Table `ClinicalRequest` deleted")
    except UndefinedTableError:
        print("Table `ClinicalRequest` not found. Continuing")

    try:
        await DecisionPoint.delete.where(DecisionPoint.id >= 0).gino.status()
        print("Table `DecisionPoint` deleted")
    except UndefinedTableError:
        print("Table `DecisionPoint` not found. Continuing")

    try:
        await OnPathway.delete.where(OnPathway.id >= 0).gino.status()
        print("Table `OnPathway` deleted")
    except UndefinedTableError:
        print("Table `OnPathway` not found. Continuing")

    try:
        await Session.delete.gino.status()
        print("Table `Session` deleted")
    except UndefinedTableError:
        print("Table `Session` not found. Continuing")

    try:
        await UserPathway.delete.gino.status()
        print("Table `UserPathway` deleted")
    except UndefinedTableError:
        print("Table `UserPathway` not found. Continuing")

    try:
        await User.delete.where(and_(
            User.id >= 0, User.username.contains('demo-')
        )).gino.status()
        print("Table `User` deleted")
    except UndefinedTableError:
        print("Table `User` not found. Continuing")

    try:
        await Patient.delete.where(Patient.id >= 0).gino.status()
        print("Table `Patient` deleted")
    except UndefinedTableError:
        print("Table `Patient` not found. Continuing")

    try:
        await PathwayClinicalRequestType.delete.where(
            ClinicalRequestType.id >= 0
        ).gino.status()
        print("Table `PathwayClinicalRequestType` deleted")
    except UndefinedTableError:
        print("Table `PathwayClinicalRequestType` not found. Continuing")

    try:
        await Pathway.delete.where(Pathway.id >= 0).gino.status()
        print("Table `Pathway` deleted")
    except UndefinedTableError:
        print("Table `Pathway` not found. Continuing")

    try:
        await ClinicalRequestType.delete.where(
            ClinicalRequestType.id >= 0).gino.status()
        print("Table `ClinicalRequestType` deleted")
    except UndefinedTableError:
        print("Table `ClinicalRequestType` not found. Continuing")


async def clear_all_users():
    try:
        await User.delete.where(User.id >= 0).gino.status()
        print("Table `User` deleted entirely")
    except UndefinedTableError:
        print("Table `User` not found. Continuing")


def main(argv):
    parser = argparse.ArgumentParser(description="Demo Management Script")
    parser.add_argument('--onlyclear', action='store_true', default=False)
    parser.add_argument('--clearall', action='store_true', default=False)
    parser.add_argument('--data', type=str, default="demo")
    arguments = parser.parse_args()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(db.set_bind(DATABASE_URL))
    dataset: str = arguments.data.lower()

    if dataset not in ["demo", "bulk", "twopathways"]:
        raise ValueError("Dataset provided is not valid")

    loop.run_until_complete(check_connection())
    loop.run_until_complete(clear_existing_data())
    if arguments.clearall:
        loop.run_until_complete(clear_all_users())
    if not arguments.onlyclear:
        loop.run_until_complete(asyncio.sleep(2))

    if dataset == "demo":
        loop.run_until_complete(
            insert_demo_data(SESSION_COOKIE=SESSION_COOKIE)
        )
    elif dataset == "bulk":
        loop.run_until_complete(
            insert_bulk_data(SESSION_COOKIE=SESSION_COOKIE)
        )
    elif dataset == "twopathways":
        loop.run_until_complete(
            insert_two_pathways_data(SESSION_COOKIE=SESSION_COOKIE)
        )


if __name__ == "__main__":
    main(sys.argv[1:])
