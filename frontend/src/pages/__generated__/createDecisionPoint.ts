/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionPointInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createDecisionPoint
// ====================================================

export interface createDecisionPoint_createDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
}

export interface createDecisionPoint {
  createDecisionPoint: createDecisionPoint_createDecisionPoint | null;
}

export interface createDecisionPointVariables {
  input: DecisionPointInput;
}
