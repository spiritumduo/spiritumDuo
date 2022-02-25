/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientOnPathwayConnection
// ====================================================

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones {
  __typename: "Milestone";
  id: string;
  updatedAt: any;
  currentState: string;
  milestoneType: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones_milestoneType;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints {
  __typename: "DecisionPoint";
  milestones: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones[] | null;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways {
  __typename: "OnPathway";
  decisionPoints: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints[] | null;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  dateOfBirth: any;
  onPathways: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways[] | null;
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
  edges: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges[] | null;
}

export interface getPatientOnPathwayConnection {
  /**
   * getPatentOnPathwayConnection:
   * This query takes either before or after arguments, but never both.
   * If neither before or after is present, it requires a first argument to
   * limit the number of results returned
   * 
   * TODO: This returns a PatientConnection. It should return a OnPathway connection
   * That requires new schema work
   */
  getPatientOnPathwayConnection: getPatientOnPathwayConnection_getPatientOnPathwayConnection;
}

export interface getPatientOnPathwayConnectionVariables {
  outstanding?: boolean | null;
  pathwayId: string;
  first?: number | null;
  after?: string | null;
  underCareOf?: boolean | null;
  includeDischarged?: boolean | null;
}
