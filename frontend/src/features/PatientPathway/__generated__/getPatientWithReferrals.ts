/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientWithReferrals
// ====================================================

export interface getPatientWithReferrals_getPatient_onPathways_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
}

export interface getPatientWithReferrals_getPatient_onPathways_clinicalRequests_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
  addedAt: any;
}

export interface getPatientWithReferrals_getPatient_onPathways_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  clinicalRequestType: getPatientWithReferrals_getPatient_onPathways_clinicalRequests_clinicalRequestType;
  addedAt: any;
  updatedAt: any;
  currentState: string;
  forwardDecisionPoint: getPatientWithReferrals_getPatient_onPathways_clinicalRequests_forwardDecisionPoint | null;
}

export interface getPatientWithReferrals_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
  referredAt: any;
  clinicalRequests: getPatientWithReferrals_getPatient_onPathways_clinicalRequests[] | null;
}

export interface getPatientWithReferrals_getPatient {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  hospitalNumber: string;
  nationalNumber: string;
  onPathways: getPatientWithReferrals_getPatient_onPathways[] | null;
}

export interface getPatientWithReferrals {
  getPatient: getPatientWithReferrals_getPatient | null;
}

export interface getPatientWithReferralsVariables {
  hospitalNumber: string;
}
