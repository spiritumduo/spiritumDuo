/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteMdtInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: deleteMdt
// ====================================================

export interface deleteMdt_deleteMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface deleteMdt_deleteMdt {
  __typename: "DeletePayload";
  success: boolean | null;
  userErrors: deleteMdt_deleteMdt_userErrors[] | null;
}

export interface deleteMdt {
  deleteMdt: deleteMdt_deleteMdt;
}

export interface deleteMdtVariables {
  input: DeleteMdtInput;
}
