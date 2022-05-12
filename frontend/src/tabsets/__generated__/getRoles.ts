/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoles
// ====================================================

export interface getRoles_getRoles_permissions {
  __typename: "RolePermission";
  name: string;
}

export interface getRoles_getRoles {
  __typename: "Role";
  id: string;
  name: string;
  permissions: (getRoles_getRoles_permissions | null)[];
}

export interface getRoles {
  getRoles: getRoles_getRoles[];
}
