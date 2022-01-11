import { gql, useMutation } from '@apollo/client';
import Patient from 'types/Patient';

export const ADD_PATIENT_MUTATION = gql`
  mutation createPatient($patient: PatientInput!) {
    createPatient(input: $patient) {
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
    },
  },
);

export default useAddPatientMutation;
