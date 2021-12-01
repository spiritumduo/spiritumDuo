/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PatientInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createPatient
// ====================================================

export interface createPatient_createPatient_userErrors {
  __typename: "UserError";
  message: string;
  field: string;
}

export interface createPatient_createPatient_patient {
  __typename: "Patient";
  id: string;
}

export interface createPatient_createPatient {
  __typename: "AddPatientPayload";
  userErrors: (createPatient_createPatient_userErrors | null)[] | null;
  patient: createPatient_createPatient_patient | null;
}

export interface createPatient {
  createPatient: createPatient_createPatient | null;
}

export interface createPatientVariables {
  patient: PatientInput;
  pathwayId: string;
}
