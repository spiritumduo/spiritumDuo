/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionPointInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: createDecisionPoint
// ====================================================

export interface createDecisionPoint_createDecisionPoint_decisionPoint_milestones_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface createDecisionPoint_createDecisionPoint_decisionPoint_milestones {
  __typename: "Milestone";
  id: string;
  milestoneType: createDecisionPoint_createDecisionPoint_decisionPoint_milestones_milestoneType;
}

export interface createDecisionPoint_createDecisionPoint_decisionPoint {
  __typename: "DecisionPoint";
  id: string;
  milestones: createDecisionPoint_createDecisionPoint_decisionPoint_milestones[] | null;
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
