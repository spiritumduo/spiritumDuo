/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: onPathwayUpdated
// ====================================================

export interface onPathwayUpdated_onPathwayUpdated {
  __typename: "OnPathway";
  id: string;
}

export interface onPathwayUpdated {
  onPathwayUpdated: onPathwayUpdated_onPathwayUpdated;
}

export interface onPathwayUpdatedVariables {
  pathwayId: string;
  includeDischarged?: boolean | null;
}
