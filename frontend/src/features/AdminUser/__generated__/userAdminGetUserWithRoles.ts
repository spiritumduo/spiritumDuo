/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userAdminGetUserWithRoles
// ====================================================

export interface userAdminGetUserWithRoles_getUser_roles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles_getUser {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  defaultPathwayId: string;
  isActive: boolean;
  roles: userAdminGetUserWithRoles_getUser_roles[];
}

export interface userAdminGetUserWithRoles_getRoles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles {
  getUser: userAdminGetUserWithRoles_getUser | null;
  getRoles: userAdminGetUserWithRoles_getRoles[];
}

export interface userAdminGetUserWithRolesVariables {
  id: string;
}
