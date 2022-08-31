/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteOnMdt
// ====================================================

export interface deleteOnMdt_deleteOnMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface deleteOnMdt_deleteOnMdt {
  __typename: "DeletePayload";
  success: boolean | null;
  userErrors: deleteOnMdt_deleteOnMdt_userErrors[] | null;
}

export interface deleteOnMdt {
  deleteOnMdt: deleteOnMdt_deleteOnMdt;
}

export interface deleteOnMdtVariables {
  id: string;
}
