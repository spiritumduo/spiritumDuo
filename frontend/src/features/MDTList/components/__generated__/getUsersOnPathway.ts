/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsersOnPathway
// ====================================================

export interface getUsersOnPathway_getUsers {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface getUsersOnPathway {
  getUsers: (getUsersOnPathway_getUsers | null)[];
}

export interface getUsersOnPathwayVariables {
  pathwayId: string;
}
