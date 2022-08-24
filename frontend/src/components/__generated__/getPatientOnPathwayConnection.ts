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

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_outstandingClinicalRequest_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_outstandingClinicalRequest {
  __typename: "ClinicalRequest";
  id: string;
  updatedAt: any;
  currentState: string;
  clinicalRequestType: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_outstandingClinicalRequest_clinicalRequestType;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_clinicalRequest_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_clinicalRequest {
  __typename: "ClinicalRequest";
  id: string;
  updatedAt: any;
  currentState: string;
  clinicalRequestType: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_clinicalRequest_clinicalRequestType;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_lockUser {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways {
  __typename: "OnPathway";
  id: string;
  outstandingClinicalRequest: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_outstandingClinicalRequest[] | null;
  clinicalRequest: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_clinicalRequest[] | null;
  lockEndTime: any | null;
  lockUser: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_lockUser | null;
  updatedAt: any;
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
  edges: getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges[];
}

export interface getPatientOnPathwayConnection {
  /**
   * getPatientOnPathwayConnection:
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
