/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdts
// ====================================================

export interface getMdts_getMdts {
  __typename: "MDT";
  id: string;
  plannedAt: any;
}

export interface getMdts {
  getMdts: (getMdts_getMdts | null)[];
}

export interface getMdtsVariables {
  pathwayId: string;
}
