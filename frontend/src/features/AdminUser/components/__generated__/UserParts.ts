/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserParts
// ====================================================

export interface UserParts_defaultPathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface UserParts_roles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface UserParts_pathways {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface UserParts {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  defaultPathway: UserParts_defaultPathway | null;
  roles: UserParts_roles[];
  pathways: UserParts_pathways[] | null;
}
