/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdtForDelete
// ====================================================

export interface getMdtForDelete_getMdt_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface getMdtForDelete_getMdt_creator {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface getMdtForDelete_getMdt {
  __typename: "MDT";
  id: string;
  pathway: getMdtForDelete_getMdt_pathway;
  creator: getMdtForDelete_getMdt_creator;
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface getMdtForDelete {
  getMdt: getMdtForDelete_getMdt | null;
}

export interface getMdtForDeleteVariables {
  pathwayId: string;
  plannedAt: any;
}
