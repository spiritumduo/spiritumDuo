/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientOnMdtConnection
// ====================================================

export interface getPatientOnMdtConnection_getPatientOnMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node_mdt_creator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node_mdt {
  __typename: "MDT";
  id: string;
  plannedAt: any;
  creator: getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node_mdt_creator;
}

export interface getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node {
  __typename: "OnMdt";
  id: string;
  outcome: string | null;
  reason: string;
  actioned: boolean;
  mdt: getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node_mdt;
}

export interface getPatientOnMdtConnection_getPatientOnMdtConnection_edges {
  __typename: "OnMdtEdge";
  cursor: string;
  node: getPatientOnMdtConnection_getPatientOnMdtConnection_edges_node;
}

export interface getPatientOnMdtConnection_getPatientOnMdtConnection {
  __typename: "OnMdtConnection";
  totalCount: number;
  pageInfo: getPatientOnMdtConnection_getPatientOnMdtConnection_pageInfo;
  edges: getPatientOnMdtConnection_getPatientOnMdtConnection_edges[];
}

export interface getPatientOnMdtConnection {
  getPatientOnMdtConnection: getPatientOnMdtConnection_getPatientOnMdtConnection;
}

export interface getPatientOnMdtConnectionVariables {
  id: string;
  pathwayId: string;
  first: number;
  after?: string | null;
}
