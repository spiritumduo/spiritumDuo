/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientWithReferrals
// ====================================================

export interface getPatientWithReferrals_getPatient_onPathways_milestones_milestoneType {
  __typename: "MilestoneType";
  id: string;
  name: string;
}

export interface getPatientWithReferrals_getPatient_onPathways_milestones_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
  addedAt: any;
}

export interface getPatientWithReferrals_getPatient_onPathways_milestones {
  __typename: "Milestone";
  id: string;
  milestoneType: getPatientWithReferrals_getPatient_onPathways_milestones_milestoneType;
  addedAt: any;
  updatedAt: any;
  currentState: string;
  forwardDecisionPoint: getPatientWithReferrals_getPatient_onPathways_milestones_forwardDecisionPoint | null;
}

export interface getPatientWithReferrals_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
  referredAt: any;
  milestones: getPatientWithReferrals_getPatient_onPathways_milestones[] | null;
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
