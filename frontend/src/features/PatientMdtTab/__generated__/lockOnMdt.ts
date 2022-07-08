/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: lockOnMdt
// ====================================================

export interface lockOnMdt_lockOnMdt_onMdt_lockUser {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface lockOnMdt_lockOnMdt_onMdt {
  __typename: "OnMdt";
  id: string;
  lockEndTime: any | null;
  lockUser: lockOnMdt_lockOnMdt_onMdt_lockUser | null;
}

export interface lockOnMdt_lockOnMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface lockOnMdt_lockOnMdt {
  __typename: "LockOnMdtPayload";
  onMdt: lockOnMdt_lockOnMdt_onMdt | null;
  userErrors: lockOnMdt_lockOnMdt_userErrors[] | null;
}

export interface lockOnMdt {
  lockOnMdt: lockOnMdt_lockOnMdt;
}

export interface lockOnMdtVariables {
  id: string;
  unlock: boolean;
}
