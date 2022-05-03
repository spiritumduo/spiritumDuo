/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserParts
// ====================================================

export interface UserParts_roles {
  __typename: "Role";
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
  defaultPathwayId: string;
  isActive: boolean;
  roles: UserParts_roles[];
}
