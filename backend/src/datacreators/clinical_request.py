from ctypes import Union
from models import Patient, OnPathway, UserPathway, Pathway
from common import UserDoesNotHavePathwayPermission
from SdTypes import ClinicalRequestState
from dataloaders import (
    OnPathwayByIdLoader, PatientByIdLoader,
    PathwayByIdLoader
)
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from trustadapter.trustadapter import (
    TestResult_IE,
    TrustAdapter,
    TestResultRequest_IE
)
from models import ClinicalRequest


@inject
async def ImportClinicalRequest(
    context=None,
    on_pathway_id: int = None,
    clinical_request_type_id: int = None,
    description: str = None,
    current_state: ClinicalRequestState = None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    """
    Creates a clinical_request object in local and external databases

    Keyword arguments:
        context (dict): the current request context
        on_pathway_id (int): the ID of the `OnPathway` instance the newly
            created ClinicalRequest is to be linked to
        clinical_request_type_id (int): the ID of the `ClinicalRequestType`
        description (str): the description/result of the request
        current_state (ClinicalRequestState): the current state of the clinical_request
            (used for data creation scripts to import data)

    Returns:
        ClinicalRequest: newly created clinical_request object
    """

    on_pathway: OnPathway = (await OnPathwayByIdLoader.load_from_id(
        context=context,
        id=int(on_pathway_id))
    )

    pathway: Pathway = await PathwayByIdLoader.load_from_id(
        context, on_pathway.pathway_id)

    userHasPathwayPermission: Union[UserPathway, None] = await UserPathway\
        .query.where(UserPathway.user_id == context['request']['user'].id)\
        .where(UserPathway.pathway_id == on_pathway.pathway_id)\
        .gino.one_or_none()

    if userHasPathwayPermission is None:
        raise UserDoesNotHavePathwayPermission(
            f"User ID: {context['request']['user'].id}"
            f"; Pathway ID: {on_pathway.pathway_id}"
        )

    patient: Patient = await PatientByIdLoader.load_from_id(
        context=context,
        id=int(on_pathway.patient_id)
    )
    testResult: TestResult_IE = await trust_adapter.create_test_result(
        TestResultRequest_IE(
            type_id=clinical_request_type_id,
            description=description,
            current_state=current_state,
            hospital_number=patient.hospital_number,
            pathway_name=pathway.name
        ), auth_token=context['request'].cookies['SDSESSION']
    )

    return await ClinicalRequest.create(
        on_pathway_id=int(on_pathway_id),
        current_state=current_state,
        clinical_request_type_id=int(clinical_request_type_id),
        test_result_reference_id=str(testResult.id)
    )
