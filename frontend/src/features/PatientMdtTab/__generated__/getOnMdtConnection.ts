/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOnMdtConnection
// ====================================================

export interface getOnMdtConnection_getOnMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getOnMdtConnection_getOnMdtConnection_edges_node_mdt_creator {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
}

export interface getOnMdtConnection_getOnMdtConnection_edges_node_mdt {
  __typename: "MDT";
  id: string;
  plannedAt: any;
  creator: getOnMdtConnection_getOnMdtConnection_edges_node_mdt_creator;
}

export interface getOnMdtConnection_getOnMdtConnection_edges_node {
  __typename: "OnMdt";
  id: string;
  outcome: string | null;
  reason: string;
  actioned: boolean;
  mdt: getOnMdtConnection_getOnMdtConnection_edges_node_mdt;
}

export interface getOnMdtConnection_getOnMdtConnection_edges {
  __typename: "OnMdtEdge";
  cursor: string;
  node: getOnMdtConnection_getOnMdtConnection_edges_node;
}

export interface getOnMdtConnection_getOnMdtConnection {
  __typename: "OnMdtConnection";
  totalCount: number;
  pageInfo: getOnMdtConnection_getOnMdtConnection_pageInfo;
  edges: getOnMdtConnection_getOnMdtConnection_edges[];
}

export interface getOnMdtConnection {
  getOnMdtConnection: getOnMdtConnection_getOnMdtConnection;
}

export interface getOnMdtConnectionVariables {
  patientId: string;
  pathwayId: string;
  first: number;
  after?: string | null;
}
