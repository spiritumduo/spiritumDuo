/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MilestoneState } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getPatientWithReferrals
// ====================================================

export interface getPatientWithReferrals_getPatient_onPathways_decisionPoints_milestones_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface getPatientWithReferrals_getPatient_onPathways_decisionPoints_milestones {
  __typename: "Milestone";
  milestoneType: getPatientWithReferrals_getPatient_onPathways_decisionPoints_milestones_milestoneType;
  addedAt: any;
  updatedAt: any;
  currentState: MilestoneState;
}

export interface getPatientWithReferrals_getPatient_onPathways_decisionPoints {
  __typename: "DecisionPoint";
  milestones: getPatientWithReferrals_getPatient_onPathways_decisionPoints_milestones[] | null;
}

export interface getPatientWithReferrals_getPatient_onPathways {
  __typename: "OnPathway";
  referredAt: any;
  decisionPoints: getPatientWithReferrals_getPatient_onPathways_decisionPoints[] | null;
}

export interface getPatientWithReferrals_getPatient {
  __typename: "Patient";
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  hospitalNumber: string;
  onPathways: getPatientWithReferrals_getPatient_onPathways[] | null;
}

export interface getPatientWithReferrals {
  getPatient: getPatientWithReferrals_getPatient | null;
}

export interface getPatientWithReferralsVariables {
  hospitalNumber: string;
}
