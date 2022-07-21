/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdt
// ====================================================

export interface getMdt_getMdt_clinicians {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface getMdt_getMdt {
  __typename: "MDT";
  id: string;
  clinicians: (getMdt_getMdt_clinicians | null)[];
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
