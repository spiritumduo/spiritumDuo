/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdtConnectionQuery
// ====================================================

export interface getMdtConnectionQuery_getMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getMdtConnectionQuery_getMdtConnection_edges_node_pathway {
  __typename: "Pathway";
  id: string;
  name: string;
}

export interface getMdtConnectionQuery_getMdtConnection_edges_node_creator {
  __typename: "User";
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface getMdtConnectionQuery_getMdtConnection_edges_node_patients {
  __typename: "Patient";
  id: string;
}

export interface getMdtConnectionQuery_getMdtConnection_edges_node {
  __typename: "MDT";
  id: string;
  pathway: getMdtConnectionQuery_getMdtConnection_edges_node_pathway;
  creator: getMdtConnectionQuery_getMdtConnection_edges_node_creator;
  patients: (getMdtConnectionQuery_getMdtConnection_edges_node_patients | null)[];
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface getMdtConnectionQuery_getMdtConnection_edges {
  __typename: "MdtEdge";
  cursor: string;
  node: getMdtConnectionQuery_getMdtConnection_edges_node;
}

export interface getMdtConnectionQuery_getMdtConnection {
  __typename: "MdtConnection";
  totalCount: number;
  pageInfo: getMdtConnectionQuery_getMdtConnection_pageInfo;
  edges: getMdtConnectionQuery_getMdtConnection_edges[];
}

export interface getMdtConnectionQuery {
  getMdtConnection: getMdtConnectionQuery_getMdtConnection;
}

export interface getMdtConnectionQueryVariables {
  first?: number | null;
  after?: string | null;
  pathwayId: string;
}
