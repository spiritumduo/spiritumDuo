/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MdtInput } from "../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createMdt
// ====================================================

export interface createMdt_createMdt_mdt_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface createMdt_createMdt_mdt_creator {
  __typename: "User";
  id: string;
  username: string;
}

export interface createMdt_createMdt_mdt {
  __typename: "MDT";
  id: string;
  pathway: createMdt_createMdt_mdt_pathway;
  creator: createMdt_createMdt_mdt_creator;
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface createMdt_createMdt_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface createMdt_createMdt {
  __typename: "MdtPayload";
  mdt: createMdt_createMdt_mdt | null;
  userErrors: createMdt_createMdt_userErrors[] | null;
}

export interface createMdt {
  createMdt: createMdt_createMdt;
}

export interface createMdtVariables {
  input: MdtInput;
}
