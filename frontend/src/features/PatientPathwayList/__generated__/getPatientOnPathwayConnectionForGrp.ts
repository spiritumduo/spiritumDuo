/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientOnPathwayConnectionForGrp
// ====================================================

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones_milestoneType {
  __typename: "MilestoneType";
  id: string;
  name: string;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones_forwardDecisionPoint {
  __typename: "DecisionPoint";
  id: string;
  addedAt: any;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones {
  __typename: "Milestone";
  id: string;
  milestoneType: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones_milestoneType;
  addedAt: any;
  updatedAt: any;
  currentState: string;
  forwardDecisionPoint: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones_forwardDecisionPoint | null;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways {
  __typename: "OnPathway";
  id: string;
  referredAt: any;
  milestones: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways_milestones[] | null;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: any;
  hospitalNumber: string;
  nationalNumber: string;
  onPathways: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node_onPathways[] | null;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges {
  __typename: "PatientEdge";
  cursor: string;
  node: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node;
}

export interface getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection {
  __typename: "PatientConnection";
  totalCount: number;
  pageInfo: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_pageInfo;
  edges: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges[];
}

export interface getPatientOnPathwayConnectionForGrp {
  /**
   * getPatentOnPathwayConnection:
   * This query takes either before or after arguments, but never both.
   * If neither before or after is present, it requires a first argument to
   * limit the number of results returned
   * 
   * TODO: This returns a PatientConnection. It should return a OnPathway connection
   * That requires new schema work
   */
  getPatientOnPathwayConnection: getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection;
}

export interface getPatientOnPathwayConnectionForGrpVariables {
  outstanding?: boolean | null;
  pathwayId: string;
  first?: number | null;
  after?: string | null;
  underCareOf?: boolean | null;
  includeDischarged?: boolean | null;
}
