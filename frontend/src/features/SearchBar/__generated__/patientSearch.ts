/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: patientSearch
// ====================================================

export interface patientSearch_patientSearch {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
}

export interface patientSearch {
  patientSearch: patientSearch_patientSearch[];
}

export interface patientSearchVariables {
  query: string;
  pathwayId: string;
}
