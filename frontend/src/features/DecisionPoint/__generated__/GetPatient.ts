/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PatientCommunicationMethods } from "../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetPatient
// ====================================================

export interface GetPatient_getPatient_onPathways_underCareOf {
  __typename: "User";
  firstName: string;
  lastName: string;
}

export interface GetPatient_getPatient_onPathways_milestones_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface GetPatient_getPatient_onPathways_milestones_testResult {
  __typename: "TestResult";
  id: string;
  description: string;
  addedAt: any;
}

export interface GetPatient_getPatient_onPathways_milestones_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface GetPatient_getPatient_onPathways_milestones {
  __typename: "Milestone";
  id: string;
  forwardDecisionPoint: GetPatient_getPatient_onPathways_milestones_forwardDecisionPoint | null;
  testResult: GetPatient_getPatient_onPathways_milestones_testResult | null;
  milestoneType: GetPatient_getPatient_onPathways_milestones_milestoneType;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_milestones_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_milestones_testResult {
  __typename: "TestResult";
  id: string;
  description: string;
  addedAt: any;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_milestones_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface GetPatient_getPatient_onPathways_decisionPoints_milestones {
  __typename: "Milestone";
  id: string;
  forwardDecisionPoint: GetPatient_getPatient_onPathways_decisionPoints_milestones_forwardDecisionPoint | null;
  testResult: GetPatient_getPatient_onPathways_decisionPoints_milestones_testResult | null;
  milestoneType: GetPatient_getPatient_onPathways_decisionPoints_milestones_milestoneType;
}

export interface GetPatient_getPatient_onPathways_decisionPoints {
  __typename: "DecisionPoint";
  clinicHistory: string;
  comorbidities: string;
  milestones: GetPatient_getPatient_onPathways_decisionPoints_milestones[] | null;
}

export interface GetPatient_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
  underCareOf: GetPatient_getPatient_onPathways_underCareOf | null;
  milestones: GetPatient_getPatient_onPathways_milestones[] | null;
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

export interface GetPatient_getMilestoneTypes {
  __typename: "MilestoneType";
  id: string;
  name: string;
  isDischarge: boolean;
  isCheckboxHidden: boolean;
  isTestRequest: boolean;
}

export interface GetPatient {
  getPatient: GetPatient_getPatient | null;
  getMilestoneTypes: GetPatient_getMilestoneTypes[] | null;
}

export interface GetPatientVariables {
  hospitalNumber?: string | null;
  pathwayId?: string | null;
  includeDischarged?: boolean | null;
}
