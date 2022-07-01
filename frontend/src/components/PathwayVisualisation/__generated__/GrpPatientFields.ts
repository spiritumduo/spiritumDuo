/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GrpPatientFields
// ====================================================

export interface GrpPatientFields_onPathways_milestones_milestoneType {
  __typename: "MilestoneType";
  id: string;
  name: string;
}

export interface GrpPatientFields_onPathways_milestones_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
  addedAt: any;
}

export interface GrpPatientFields_onPathways_milestones {
  __typename: "Milestone";
  id: string;
  milestoneType: GrpPatientFields_onPathways_milestones_milestoneType;
  addedAt: any;
  updatedAt: any;
  currentState: string;
  forwardDecisionPoint: GrpPatientFields_onPathways_milestones_forwardDecisionPoint | null;
}

export interface GrpPatientFields_onPathways {
  __typename: "OnPathway";
  id: string;
  referredAt: any;
  milestones: GrpPatientFields_onPathways_milestones[] | null;
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
