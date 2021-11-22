/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  department: string;
}

export interface login {
  login: login_login | null;
}

export interface loginVariables {
  username: string;
  password: string;
}
