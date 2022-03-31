/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientOnCurrentPathway
// ====================================================

export interface getPatientOnCurrentPathway_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
}

export interface getPatientOnCurrentPathway_getPatient {
  __typename: "Patient";
  id: string;
  onPathways: getPatientOnCurrentPathway_getPatient_onPathways[] | null;
}

export interface getPatientOnCurrentPathway {
  getPatient: getPatientOnCurrentPathway_getPatient | null;
}

export interface getPatientOnCurrentPathwayVariables {
  hospitalNumber: string;
  pathwayId: string;
}
