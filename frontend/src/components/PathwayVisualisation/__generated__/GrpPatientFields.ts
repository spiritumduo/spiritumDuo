/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GrpPatientFields
// ====================================================

export interface GrpPatientFields_onPathways_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
}

export interface GrpPatientFields_onPathways_clinicalRequests_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
  addedAt: any;
}

export interface GrpPatientFields_onPathways_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  clinicalRequestType: GrpPatientFields_onPathways_clinicalRequests_clinicalRequestType;
  addedAt: any;
  updatedAt: any;
  currentState: string;
  forwardDecisionPoint: GrpPatientFields_onPathways_clinicalRequests_forwardDecisionPoint | null;
}

export interface GrpPatientFields_onPathways {
  __typename: "OnPathway";
  id: string;
  referredAt: any;
  clinicalRequests: GrpPatientFields_onPathways_clinicalRequests[] | null;
}

export interface GrpPatientFields {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  hospitalNumber: string;
  nationalNumber: string;
  onPathways: GrpPatientFields_onPathways[] | null;
}
