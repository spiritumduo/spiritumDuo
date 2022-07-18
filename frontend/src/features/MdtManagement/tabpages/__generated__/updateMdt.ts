/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateMdtInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateMdt
// ====================================================

export interface updateMdt_updateMdt_mdt_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface updateMdt_updateMdt_mdt_creator {
  __typename: "User";
  id: string;
  username: string;
}

export interface updateMdt_updateMdt_mdt {
  __typename: "MDT";
  id: string;
  pathway: updateMdt_updateMdt_mdt_pathway;
  creator: updateMdt_updateMdt_mdt_creator;
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface updateMdt_updateMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface updateMdt_updateMdt {
  __typename: "MdtPayload";
  mdt: updateMdt_updateMdt_mdt | null;
  userErrors: updateMdt_updateMdt_userErrors[] | null;
}

export interface updateMdt {
  updateMdt: updateMdt_updateMdt;
}

export interface updateMdtVariables {
  input: UpdateMdtInput;
}
