/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PathwayInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createPathway
// ====================================================

export interface createPathway_createPathway_pathway_clinicalRequestTypes {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
  refName: string;
}

export interface createPathway_createPathway_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
  clinicalRequestTypes: createPathway_createPathway_pathway_clinicalRequestTypes[] | null;
}

export interface createPathway_createPathway_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface createPathway_createPathway {
  __typename: "AddPathwayPayload";
  pathway: createPathway_createPathway_pathway | null;
  userErrors: createPathway_createPathway_userErrors[] | null;
}

export interface createPathway {
  createPathway: createPathway_createPathway;
}

export interface createPathwayVariables {
  input: PathwayInput;
}
