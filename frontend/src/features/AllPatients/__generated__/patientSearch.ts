/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: patientSearch
// ====================================================

export interface patientSearch_patientSearch_onPathways_outstandingMilestone_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface patientSearch_patientSearch_onPathways_outstandingMilestone {
  __typename: "Milestone";
  id: string;
  updatedAt: any;
  milestoneType: patientSearch_patientSearch_onPathways_outstandingMilestone_milestoneType;
}

export interface patientSearch_patientSearch_onPathways_milestone_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface patientSearch_patientSearch_onPathways_milestone {
  __typename: "Milestone";
  id: string;
  updatedAt: any;
  milestoneType: patientSearch_patientSearch_onPathways_milestone_milestoneType;
}

export interface patientSearch_patientSearch_onPathways_lockUser {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface patientSearch_patientSearch_onPathways {
  __typename: "OnPathway";
  outstandingMilestone: patientSearch_patientSearch_onPathways_outstandingMilestone[] | null;
  milestone: patientSearch_patientSearch_onPathways_milestone[] | null;
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
