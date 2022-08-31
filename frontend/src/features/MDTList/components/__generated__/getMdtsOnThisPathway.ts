/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdtsOnThisPathway
// ====================================================

export interface getMdtsOnThisPathway_getMdts {
  __typename: "MDT";
  id: string;
  plannedAt: any;
}

export interface getMdtsOnThisPathway {
  getMdts: (getMdtsOnThisPathway_getMdts | null)[];
}

export interface getMdtsOnThisPathwayVariables {
  pathwayId: string;
}
