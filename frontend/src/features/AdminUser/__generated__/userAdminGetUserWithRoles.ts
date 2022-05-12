/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userAdminGetUserWithRoles
// ====================================================

export interface userAdminGetUserWithRoles_getUser_defaultPathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles_getUser_roles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles_getUser_pathways {
  __typename: "Pathway";
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
  isActive: boolean;
  defaultPathway: userAdminGetUserWithRoles_getUser_defaultPathway | null;
  roles: userAdminGetUserWithRoles_getUser_roles[];
  pathways: userAdminGetUserWithRoles_getUser_pathways[];
}

export interface userAdminGetUserWithRoles_getRoles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles_getPathways {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface userAdminGetUserWithRoles {
  getUser: userAdminGetUserWithRoles_getUser | null;
  getRoles: userAdminGetUserWithRoles_getRoles[];
  getPathways: userAdminGetUserWithRoles_getPathways[];
}

export interface userAdminGetUserWithRolesVariables {
  id: string;
}
