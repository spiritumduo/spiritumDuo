/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdtForUpdate
// ====================================================

export interface getMdtForUpdate_getMdt_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface getMdtForUpdate_getMdt_creator {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface getMdtForUpdate_getMdt {
  __typename: "MDT";
  id: string;
  pathway: getMdtForUpdate_getMdt_pathway;
  creator: getMdtForUpdate_getMdt_creator;
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface getMdtForUpdate {
  getMdt: getMdtForUpdate_getMdt | null;
}

export interface getMdtForUpdateVariables {
  pathwayId: string;
  plannedAt: any;
}
