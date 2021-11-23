/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DecisionPointType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getPatientOnPathwayConnection
// ====================================================

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges {
  __typename: "PatientEdge";
  cursor: string;
  node: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection {
  __typename: "PatientConnection";
  totalCount: number;
  pageInfo: getPatientOnPathwayConnection_getPatientOnPathwayConnection_pageInfo;
  edges: (getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges | null)[] | null;
}

export interface getPatientOnPathwayConnection {
  /**
   * getPatentOnPathwayConnection:
   * This query takes either before or after arguments, but never both.
   * If neither before or after is present, it requires a first argument to
   * limit the number of results returned
   * 
   * TODO: This returns a PatientConnection. It should return a PatientPathwayInstance connection
   * That requires new schema work
   */
  getPatientOnPathwayConnection: getPatientOnPathwayConnection_getPatientOnPathwayConnection;
}

export interface getPatientOnPathwayConnectionVariables {
  pathwayId: string;
  awaitingDecisionType: DecisionPointType;
  first?: number | null;
}
