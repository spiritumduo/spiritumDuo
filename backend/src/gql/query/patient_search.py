import asyncio
import logging

from .query_type import query
from dataloaders import (
    PatientByIdLoader, PatientByHospitalNumberLoader,
    PatientByHospitalNumberFromIELoader
)
from authentication.authentication import needsAuthorization
from graphql.type import GraphQLResolveInfo
from SdTypes import Permissions
from models import Patient, OnPathway
from containers import SDContainer
from trustadapter import TrustAdapter
from dependency_injector.wiring import Provide, inject


@query.field("patientSearch")
@needsAuthorization([Permissions.PATIENT_READ])
@inject
async def resolve_patient_search(
    obj=None,
    info: GraphQLResolveInfo = None,
    query: str = None,
    pathwayId: str = None,
    trust_adapter: TrustAdapter = Provide[
        SDContainer.trust_adapter_service
    ]
):
    """query = info.context['db'].select([Patient]) \
        .where(OnPathway.pathway_id == pathwayId)\
        .select_from(
            Patient.join(
                OnPathway,
                OnPathway.patient_id == Patient.id
            )
    )"""
    logging.warning(query)
    if pathwayId is not None:
        join_query = Patient.join(OnPathway)\
            .select()\
            .where(OnPathway.pathway_id == int(pathwayId))\
            .execution_options(loader=Patient)
        patients_query = join_query.gino.all()
    else:
        patients_query = Patient.query.gino.all()

    search_request = trust_adapter.patient_search(query)

    [patients_results, search_results] = await asyncio.gather(
        patients_query, search_request)
    for patient in patients_results:
        PatientByIdLoader.prime(
            key=patient.id, value=patient,
            context=info.context)
        PatientByHospitalNumberLoader.prime(
            key=patient.hospital_number, value=patient,
            context=info.context)

    for patient_ie in search_results:
        PatientByHospitalNumberFromIELoader.prime(
            key=patient_ie.hospital_number,
            value=patient_ie, context=info.context
        )
    # We have Patient_IE and patient model, so we need a way to compare
    # two sets of different type
    # Both sets have hospital_number...
    patient_hospital_numbers = set(
        map(lambda p: p.hospital_number, patients_results))
    search_hospital_numbers = set(
        map(lambda p: p.hospital_number, search_results))
    valid_hospital_numbers = search_hospital_numbers.intersection(
        patient_hospital_numbers)
    patients = await PatientByHospitalNumberLoader.load_many_from_id(
        info.context, [*valid_hospital_numbers])
    return patients
