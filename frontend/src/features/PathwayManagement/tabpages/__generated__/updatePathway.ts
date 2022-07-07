/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdatePathwayInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updatePathway
// ====================================================

export interface updatePathway_updatePathway_pathway_clinicalRequestTypes {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
  refName: string;
}

export interface updatePathway_updatePathway_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
  clinicalRequestTypes: updatePathway_updatePathway_pathway_clinicalRequestTypes[] | null;
}

export interface updatePathway_updatePathway_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface updatePathway_updatePathway {
  __typename: "AddPathwayPayload";
  pathway: updatePathway_updatePathway_pathway | null;
  userErrors: updatePathway_updatePathway_userErrors[] | null;
}

export interface updatePathway {
  updatePathway: updatePathway_updatePathway;
}

export interface updatePathwayVariables {
  input: UpdatePathwayInput;
}
