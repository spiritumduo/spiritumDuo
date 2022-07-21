/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOnMdtInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateOnMdt
// ====================================================

export interface updateOnMdt_updateOnMdt_onMdt {
  __typename: "OnMdt";
  id: string;
  reason: string;
}

export interface updateOnMdt_updateOnMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface updateOnMdt_updateOnMdt {
  __typename: "OnMdtPayload";
  onMdt: updateOnMdt_updateOnMdt_onMdt | null;
  userErrors: updateOnMdt_updateOnMdt_userErrors[] | null;
}

export interface updateOnMdt {
  updateOnMdt: updateOnMdt_updateOnMdt;
}

export interface updateOnMdtVariables {
  input: UpdateOnMdtInput;
}
