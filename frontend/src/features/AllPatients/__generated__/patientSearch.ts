/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: patientSearch
// ====================================================

export interface patientSearch_patientSearch_onPathways_outstandingClinicalRequest_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface patientSearch_patientSearch_onPathways_outstandingClinicalRequest {
  __typename: "ClinicalRequest";
  id: string;
  updatedAt: any;
  clinicalRequestType: patientSearch_patientSearch_onPathways_outstandingClinicalRequest_clinicalRequestType;
}

export interface patientSearch_patientSearch_onPathways_clinicalRequest_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface patientSearch_patientSearch_onPathways_clinicalRequest {
  __typename: "ClinicalRequest";
  id: string;
  updatedAt: any;
  clinicalRequestType: patientSearch_patientSearch_onPathways_clinicalRequest_clinicalRequestType;
}

export interface patientSearch_patientSearch_onPathways_lockUser {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface patientSearch_patientSearch_onPathways {
  __typename: "OnPathway";
  outstandingClinicalRequest: patientSearch_patientSearch_onPathways_outstandingClinicalRequest[] | null;
  clinicalRequest: patientSearch_patientSearch_onPathways_clinicalRequest[] | null;
  lockUser: patientSearch_patientSearch_onPathways_lockUser | null;
  lockEndTime: any | null;
}

export interface patientSearch_patientSearch {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
  onPathways: patientSearch_patientSearch_onPathways[] | null;
}

export interface patientSearch {
  patientSearch: patientSearch_patientSearch[];
}

export interface patientSearchVariables {
  query: string;
  pathwayId: string;
}
