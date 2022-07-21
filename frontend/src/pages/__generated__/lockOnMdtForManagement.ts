/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: lockOnMdtForManagement
// ====================================================

export interface lockOnMdtForManagement_lockOnMdt_onMdt_lockUser {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface lockOnMdtForManagement_lockOnMdt_onMdt {
  __typename: "OnMdt";
  id: string;
  lockEndTime: any | null;
  lockUser: lockOnMdtForManagement_lockOnMdt_onMdt_lockUser | null;
}

export interface lockOnMdtForManagement_lockOnMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface lockOnMdtForManagement_lockOnMdt {
  __typename: "LockOnMdtPayload";
  onMdt: lockOnMdtForManagement_lockOnMdt_onMdt | null;
  userErrors: lockOnMdtForManagement_lockOnMdt_userErrors[] | null;
}

export interface lockOnMdtForManagement {
  lockOnMdt: lockOnMdtForManagement_lockOnMdt;
}

export interface lockOnMdtForManagementVariables {
  id: string;
  unlock: boolean;
}
