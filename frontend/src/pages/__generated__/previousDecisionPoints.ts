/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionType } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: previousDecisionPoints
// ====================================================

export interface previousDecisionPoints_getPatient_decisionPoints_clinician {
  __typename: "User";
  firstName: string;
  lastName: string;
}

export interface previousDecisionPoints_getPatient_decisionPoints {
  __typename: "DecisionPoint";
  id: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities: string;
  clinician: previousDecisionPoints_getPatient_decisionPoints_clinician;
  addedAt: any;
  updatedAt: any;
  requestsReferrals: string;
}

export interface previousDecisionPoints_getPatient {
  __typename: "Patient";
  decisionPoints: previousDecisionPoints_getPatient_decisionPoints[] | null;
}

export interface previousDecisionPoints {
  getPatient: previousDecisionPoints_getPatient | null;
}

export interface previousDecisionPointsVariables {
  hospitalNumber: string;
  pathwayId: string;
}
