/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionType } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: previousDecisionPoints
// ====================================================

export interface previousDecisionPoints_getPatient_onPathways_decisionPoints_clinician {
  __typename: "User";
  firstName: string;
  lastName: string;
}

export interface previousDecisionPoints_getPatient_onPathways_decisionPoints_clinicalRequests_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface previousDecisionPoints_getPatient_onPathways_decisionPoints_clinicalRequests {
  __typename: "ClinicalRequest";
  id: string;
  currentState: string;
  clinicalRequestType: previousDecisionPoints_getPatient_onPathways_decisionPoints_clinicalRequests_clinicalRequestType;
}

export interface previousDecisionPoints_getPatient_onPathways_decisionPoints {
  __typename: "DecisionPoint";
  id: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities: string;
  clinician: previousDecisionPoints_getPatient_onPathways_decisionPoints_clinician;
  clinicalRequests: previousDecisionPoints_getPatient_onPathways_decisionPoints_clinicalRequests[] | null;
  addedAt: any;
  updatedAt: any;
}

export interface previousDecisionPoints_getPatient_onPathways {
  __typename: "OnPathway";
  id: string;
  decisionPoints: previousDecisionPoints_getPatient_onPathways_decisionPoints[] | null;
}

export interface previousDecisionPoints_getPatient {
  __typename: "Patient";
  onPathways: previousDecisionPoints_getPatient_onPathways[] | null;
}

export interface previousDecisionPoints {
  getPatient: previousDecisionPoints_getPatient | null;
}

export interface previousDecisionPointsVariables {
  hospitalNumber: string;
  pathwayId: string;
  includeDischarged?: boolean | null;
}
