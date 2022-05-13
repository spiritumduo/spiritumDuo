/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: userAdminGetRolesWithPathways
// ====================================================

export interface userAdminGetRolesWithPathways_getRoles {
  __typename: "Role";
  id: string;
  name: string;
}

export interface userAdminGetRolesWithPathways_getPathways {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface userAdminGetRolesWithPathways {
  getRoles: userAdminGetRolesWithPathways_getRoles[];
  getPathways: userAdminGetRolesWithPathways_getPathways[];
}
