/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOnMdtInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateOnMdtForPtModal
// ====================================================

export interface updateOnMdtForPtModal_updateOnMdt_onMdt {
  __typename: "OnMdt";
  id: string;
}

export interface updateOnMdtForPtModal_updateOnMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface updateOnMdtForPtModal_updateOnMdt {
  __typename: "OnMdtPayload";
  onMdt: updateOnMdtForPtModal_updateOnMdt_onMdt | null;
  userErrors: updateOnMdtForPtModal_updateOnMdt_userErrors[] | null;
}

export interface updateOnMdtForPtModal {
  updateOnMdt: updateOnMdtForPtModal_updateOnMdt;
}

export interface updateOnMdtForPtModalVariables {
  input: UpdateOnMdtInput;
}
