from hamcrest import assert_that, has_item
from trustadapter.trustadapter import Patient_IE


async def test_patient_search(
        login_user, test_client, patient_read_permission,
        test_patients, test_patients_on_pathway, test_pathway,
        mock_trust_adapter,
):
    mock_patients = []
    for patient in test_patients:
        mock_patients.append(
            Patient_IE(
                hospital_number=patient.hospital_number,
                national_number=patient.national_number,
                first_name=f"test-patient-{patient.id}",
                last_name=f"test-patient-{patient.id}",

            )
        )
    # Patients that don't exist in our system but do externally
    invalid_patient_1 = Patient_IE(
        hospital_number="invalid_hospital_number_1",
        national_number="invalid_national_number_1",
        first_name="invalid patient 1",
        last_name="invalid patient 1"
    )
    invalid_patient_2 = Patient_IE(
        hospital_number="invalid_hospital_number_2",
        national_number="invalid_national_number_2",
        first_name="invalid patient 2",
        last_name="invalid patient 2"
    )

    patient_1 = mock_patients[1]
    patient_2 = mock_patients[2]
    patient_3 = mock_patients[5]
    patient_4 = mock_patients[7]

    mock_trust_adapter.patient_search.return_value = [
        patient_1, patient_2, patient_3, patient_4,
        invalid_patient_1, invalid_patient_2
    ]

    query_string = f"{patient_1.last_name} {patient_2.first_name} {patient_3.hospital_number} {patient_4.national_number}"
    response = await test_client.post(
        path="/graphql",
        json={
            "query": (
                """query patientSearch($query: String!, $pathwayId: ID!) {
                    patientSearch(query: $query, pathwayId: $pathwayId) {
                        id
                        firstName
                        lastName
                        hospitalNumber
                        nationalNumber
                    }
                }"""
            ),
            "variables": {
                "query": query_string,
                "pathwayId": test_pathway.id
            }
        }
    )
    response = response.json()
    # logging.warning(response)
    expected_values = list(map(lambda x: {
        "hospitalNumber": x.hospital_number,
        "nationalNumber": x.national_number,
        "firstName": x.first_name,
        "lastName": x.last_name,
    }, [patient_1, patient_2, patient_3, patient_4]))

    received_values = list(map(lambda x: {
        "hospitalNumber": x['hospitalNumber'],
        "nationalNumber": x['nationalNumber'],
        "firstName": x['firstName'],
        "lastName": x['lastName'],
    }, response['data']['patientSearch']))

    for value in expected_values:
        assert_that(received_values, has_item(value))
