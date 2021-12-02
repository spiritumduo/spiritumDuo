/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PatientCommunicationMethods } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetPatient
// ====================================================

export interface GetPatient_getPatient_decisionPoints {
  __typename: "DecisionPoint";
  clinicHistory: string;
  comorbidities: string;
}

export interface GetPatient_getPatient {
  __typename: "Patient";
  hospitalNumber: string;
  id: string;
  communicationMethod: PatientCommunicationMethods;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  decisionPoints: GetPatient_getPatient_decisionPoints[] | null;
}

export interface GetPatient {
  getPatient: GetPatient_getPatient | null;
}

export interface GetPatientVariables {
  hospitalNumber?: string | null;
}
