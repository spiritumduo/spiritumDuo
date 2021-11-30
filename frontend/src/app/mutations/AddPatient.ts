import { gql, useMutation } from '@apollo/client';
import Patient from 'types/Patient';

export const ADD_PATIENT_MUTATION = gql`
  mutation addPatient($patient: PatientInput!, $pathwayId: ID!) {
    addPatient(patient: $patient, pathwayId: $pathwayId) {
      userErrors {
        message
        field
      }
      patient {
        id
      }
    }
  }
`;

const useAddPatientMutation = (
  patient: Patient, pathwayId: number,
) => useMutation(
  ADD_PATIENT_MUTATION, {
    variables: {
      patient: patient,
      pathwayId: pathwayId,
    },
  },
);

export default useAddPatientMutation;
