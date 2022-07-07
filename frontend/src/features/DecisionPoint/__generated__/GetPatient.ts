/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PatientCommunicationMethods } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetPatient
// ====================================================

export interface GetPatient_getPatient_onPathways_underCareOf {
  __typename: "User";
  firstName: string;
  lastName: string;
}

export interface GetPatient_getPatient_onPathways_clinicalRequests_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface GetPatient_getPatient_onPathways_clinicalRequests_testResult {
  __typename: "TestResult";
  id: string;
  description: string;
  addedAt: any;
}

export interface GetPatient_getPatient_onPathways_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface GetPatient_getPatient_onPathways_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  forwardDecisionPoint: GetPatient_getPatient_onPathways_clinicalRequests_forwardDecisionPoint | null;
  testResult: GetPatient_getPatient_onPathways_clinicalRequests_testResult | null;
  clinicalRequestType: GetPatient_getPatient_onPathways_clinicalRequests_clinicalRequestType;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_testResult {
  __typename: "TestResult";
  id: string;
  description: string;
  addedAt: any;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  forwardDecisionPoint: GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_forwardDecisionPoint | null;
  testResult: GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_testResult | null;
  clinicalRequestType: GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests_clinicalRequestType;
}

export interface GetPatient_getPatient_onPathways_decisionPoints {
  __typename: "DecisionPoint";
  clinicHistory: string;
  comorbidities: string;
  clinicalRequests: GetPatient_getPatient_onPathways_decisionPoints_clinicalRequests[] | null;
}

export interface GetPatient_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
  underCareOf: GetPatient_getPatient_onPathways_underCareOf | null;
  clinicalRequests: GetPatient_getPatient_onPathways_clinicalRequests[] | null;
  decisionPoints: GetPatient_getPatient_onPathways_decisionPoints[] | null;
}

export interface GetPatient_getPatient {
  __typename: "Patient";
  hospitalNumber: string;
  id: string;
  communicationMethod: PatientCommunicationMethods;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  onPathways: GetPatient_getPatient_onPathways[] | null;
}

export interface GetPatient_getClinicalRequestTypes {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
  isDischarge: boolean;
  isCheckboxHidden: boolean;
  isTestRequest: boolean;
  isMdt: boolean;
}

export interface GetPatient {
  getPatient: GetPatient_getPatient | null;
  getClinicalRequestTypes: GetPatient_getClinicalRequestTypes[] | null;
}

export interface GetPatientVariables {
  hospitalNumber?: string | null;
  pathwayId?: string | null;
  includeDischarged?: boolean | null;
}
