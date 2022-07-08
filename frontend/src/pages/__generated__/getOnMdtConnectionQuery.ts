/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOnMdtConnectionQuery
// ====================================================

export interface getOnMdtConnectionQuery_getOnMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getOnMdtConnectionQuery_getOnMdtConnection_edges_node_patient {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
}

export interface getOnMdtConnectionQuery_getOnMdtConnection_edges_node {
  __typename: "OnMdt";
  id: string;
  reason: string;
  patient: getOnMdtConnectionQuery_getOnMdtConnection_edges_node_patient;
}

export interface getOnMdtConnectionQuery_getOnMdtConnection_edges {
  __typename: "OnMdtEdge";
  cursor: string;
  node: getOnMdtConnectionQuery_getOnMdtConnection_edges_node;
}

export interface getOnMdtConnectionQuery_getOnMdtConnection {
  __typename: "OnMdtConnection";
  totalCount: number;
  pageInfo: getOnMdtConnectionQuery_getOnMdtConnection_pageInfo;
  edges: getOnMdtConnectionQuery_getOnMdtConnection_edges[];
}

export interface getOnMdtConnectionQuery {
  getOnMdtConnection: getOnMdtConnectionQuery_getOnMdtConnection;
}

export interface getOnMdtConnectionQueryVariables {
  first?: number | null;
  after?: string | null;
  id: string;
}
