/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionPointInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createDecisionPoint
// ====================================================

export interface createDecisionPoint_createDecisionPoint_decisionPoint_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
  isDischarge: boolean;
}

export interface createDecisionPoint_createDecisionPoint_decisionPoint_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  clinicalRequestType: createDecisionPoint_createDecisionPoint_decisionPoint_clinicalRequests_clinicalRequestType;
}

export interface createDecisionPoint_createDecisionPoint_decisionPoint {
  __typename: "DecisionPoint";
  id: string;
  clinicalRequests: createDecisionPoint_createDecisionPoint_decisionPoint_clinicalRequests[] | null;
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
