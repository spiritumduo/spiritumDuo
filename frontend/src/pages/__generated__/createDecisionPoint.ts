/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionPointInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createDecisionPoint
// ====================================================

export interface createDecisionPoint_createDecisionPoint_decisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface createDecisionPoint_createDecisionPoint_userErrors {
  __typename: "UserError";
  message: string;
  field: string;
}

export interface createDecisionPoint_createDecisionPoint {
  __typename: "AddDecisionPointPayload";
  decisionPoint: createDecisionPoint_createDecisionPoint_decisionPoint | null;
  userErrors: createDecisionPoint_createDecisionPoint_userErrors[] | null;
}

export interface createDecisionPoint {
  createDecisionPoint: createDecisionPoint_createDecisionPoint;
}

export interface createDecisionPointVariables {
  input: DecisionPointInput;
}
