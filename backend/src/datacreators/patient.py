import re
from dependency_injector.wiring import Provide, inject
from containers import SDContainer
from models import Patient, OnPathway, ClinicalRequest, Pathway
from datetime import date, datetime
from dataloaders import (
    PathwayByIdLoader,
    OnPathwaysByPatient,
    ClinicalRequestTypeLoader
)
from config import config as SdConfig
from typing import Optional, List, Union
from trustadapter.trustadapter import (
    Patient_IE,
    TestResult_IE,
    TestResultRequestImmediately_IE,
    TrustAdapter
)
from common import ReferencedItemDoesNotExistError, DataCreatorInputErrors
from asyncpg.exceptions import UniqueViolationError


@inject
async def CreatePatient(
    context: dict = None,
    first_name: str = None,
    last_name: str = None,
    hospital_number: str = None,
    national_number: str = None,
    date_of_birth: date = None,
    communication_method: Optional[str] = "LETTER",
    pathwayId: int = None,
    referred_at: datetime = None,
    awaiting_decision_type: Optional[str] = "TRIAGE",
    clinical_requests: List[ClinicalRequest] = None,
    trust_adapter: TrustAdapter = Provide[SDContainer.trust_adapter_service]
):
    """
    Creates a patient object in local and external databases

    Keyword arguments:
        context (dict): the current request context
        first_name (str): Patient's first name
        last_name (str): Patient's last name
        hospital_number (str): hospital number of patient
        national_number (str): national number of patient
        date_of_birth (date): date of birth of patient
        communication_method (str): optimal communication method for patient
        pathwayId (int): ID of pathway the patient is to be added to
        referred_at (datetime): time of the patient's referral (used for
            importing patients)
        awaiting_decision_type (DecisionType): next decision type (used for
            importing patients)
        clinical_requests (List[ClinicalRequest]): list of clinical_requests to import when a
            patient enters the pathway (referral letter, ex)
    Returns:
        Patient/DataCreatorInputErrors: newly created decision point
            object/list of errors
    """

    await trust_adapter.test_connection(
        auth_token=context['request'].cookies['SDSESSION']
    )

    if context is None:
        raise TypeError("Context is not provided.")
    if pathwayId is None:
        raise TypeError("Pathway ID not provided.")

    auth_token = context['request'].cookies['SDSESSION']
    errors = DataCreatorInputErrors()

    clinicalRequestTypesFromClinicalRequests = await ClinicalRequestTypeLoader.load_many_from_id(
        context=context,
        ids=[int(cr['clinicalRequestTypeId']) for cr in clinical_requests]
    )
    if None in clinicalRequestTypesFromClinicalRequests:
        raise ReferencedItemDoesNotExistError("""
            ClinicalRequest type specified
            does not exist
        """)

    _pathway: Pathway = await PathwayByIdLoader.load_from_id(
        context=context,
        id=pathwayId
    )
    if _pathway is None:
        raise ReferencedItemDoesNotExistError("""
            Pathway provided does not exist.
        """)

    # check if hospital number provided matches regex in configuration
    if re.search(SdConfig["HOSPITAL_NUMBER_REGEX"], hospital_number) is None:
        errors.addError(
            field="hospital_number",
            message="Input does not match expected pattern"
        )

    if re.search(SdConfig["NATIONAL_NUMBER_REGEX"], national_number) is None:
        errors.addError(
            field="national_number",
            message="Input does not match expected pattern"
        )

    if errors.hasErrors():
        return errors

    patientFromTrustAdapter: Patient_IE = await trust_adapter.load_patient(
        hospitalNumber=hospital_number,
        auth_token=auth_token
    )
    if patientFromTrustAdapter:
        """
        The patient exists via the trust adapter
        """
        if patientFromTrustAdapter.first_name != first_name:
            errors.addError(
                field="first_name",
                message="Input does not match patient from external system"
            )
        if patientFromTrustAdapter.last_name != last_name:
            errors.addError(
                field="last_name",
                message="Input does not match patient from external system"
            )
        if patientFromTrustAdapter.date_of_birth != date_of_birth:
            errors.addError(
                field="date_of_birth",
                message="Input does not match patient from external system"
            )
        if patientFromTrustAdapter.national_number != national_number:
            errors.addError(
                field="national_number",
                message="Input does not match patient from external system"
            )
        if errors.hasErrors():
            return errors
    else:
        """
        The patient does not exist via trust adapter and needs to be created
        """
        patientFromTrustAdapter: Patient_IE = await trust_adapter.create_patient(
            patient=Patient_IE(
                first_name=first_name,
                last_name=last_name,
                communication_method=communication_method,
                hospital_number=hospital_number,
                national_number=national_number,
                date_of_birth=date_of_birth
            ),
            auth_token=auth_token
        )

    try:
        """
        Create the patient in backend
        """
        patientFromLocal: Patient = await Patient.create(
            hospital_number=patientFromTrustAdapter.hospital_number,
            national_number=patientFromTrustAdapter.national_number
        )
    except UniqueViolationError:
        """
        The patient exists in backend already
        """
        if national_number != patientFromTrustAdapter.national_number:
            raise Exception("""
                A patient does not exist via TA, but does exist locally.
                An attempt was made to use the local record,
                however national_number does not match the
                expected value via the TrustAdapter
            """)

        print(f"""
            The patient {hospital_number} already exists in backend,
            while not existing in pseudotie
        """)

        patientFromLocal = await Patient.query.where(
            Patient.hospital_number == patientFromTrustAdapter.hospital_number
        ).gino.one_or_none()

    patientOnPathway: Union[OnPathway, None] = await OnPathwaysByPatient.load_from_id(
        context=context,
        id=patientFromLocal.id,
        pathwayId=_pathway.id,
        includeDischarged=False
    )
    if patientOnPathway is not None and len(patientOnPathway) > 0:
        # if there is an active pathway instance
        errors.addError(
            field="patient",
            message="""
                Patient already belongs to this
                pathway and is not discharged
            """
        )
        return errors

    onPathwayInformation = {
        'patient_id': patientFromLocal.id,
        'pathway_id': _pathway.id,
        'awaiting_decision_type': awaiting_decision_type,
        'is_discharged': False,
    }
    if referred_at:
        onPathwayInformation['referred_at'] = referred_at

    _pathwayInstance: OnPathway = await OnPathway.create(
        **onPathwayInformation
    )

    for clinical_request in clinical_requests:
        test_result: TestResult_IE = await trust_adapter.create_test_result_immediately(
            TestResultRequestImmediately_IE(
                type_id=clinical_request["clinicalRequestTypeId"],
                current_state=clinical_request["currentState"],
                hospital_number=hospital_number,
                pathway_name=_pathway.name
            ),
            auth_token=auth_token
        )

        await ClinicalRequest.create(
            on_pathway_id=int(_pathwayInstance.id),
            current_state=clinical_request["currentState"],
            clinical_request_type_id=int(clinical_request["clinicalRequestTypeId"]),
            test_result_reference_id=str(test_result.id)
        )

    returnPatient = patientFromTrustAdapter
    returnPatient.id = patientFromLocal.id
    return returnPatient
