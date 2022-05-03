/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPathways
// ====================================================

export interface getPathways_getPathways_milestoneTypes {
  __typename: "MilestoneType";
  id: string;
  name: string;
  refName: string;
}

export interface getPathways_getPathways {
  __typename: "Pathway";
  id: string;
  name: string;
  milestoneTypes: getPathways_getPathways_milestoneTypes[] | null;
}

export interface getPathways {
  getPathways: (getPathways_getPathways | null)[] | null;
}
