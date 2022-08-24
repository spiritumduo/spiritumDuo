/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deletePathway
// ====================================================

export interface deletePathway_deletePathway_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface deletePathway_deletePathway {
  __typename: "DeletePayload";
  success: boolean | null;
  userErrors: deletePathway_deletePathway_userErrors[] | null;
}

export interface deletePathway {
  deletePathway: deletePathway_deletePathway;
}

export interface deletePathwayVariables {
  pathwayId: string;
}
