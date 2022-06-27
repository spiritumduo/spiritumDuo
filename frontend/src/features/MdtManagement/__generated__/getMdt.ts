/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdt
// ====================================================

export interface getMdt_getMdt_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface getMdt_getMdt_creator {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface getMdt_getMdt {
  __typename: "MDT";
  id: string;
  pathway: getMdt_getMdt_pathway;
  creator: getMdt_getMdt_creator;
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface getMdt {
  getMdt: getMdt_getMdt | null;
}

export interface getMdtVariables {
  id: string;
}
