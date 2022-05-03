/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserListQuery
// ====================================================

export interface UserListQuery_getUserConnection_pageInfo {
  __typename: "PageInfo";
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface UserListQuery_getUserConnection_edges_node {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface UserListQuery_getUserConnection_edges {
  __typename: "UserEdge";
  node: UserListQuery_getUserConnection_edges_node;
  cursor: string;
}

export interface UserListQuery_getUserConnection {
  __typename: "UserConnection";
  totalCount: number;
  pageInfo: UserListQuery_getUserConnection_pageInfo;
  edges: UserListQuery_getUserConnection_edges[];
}

export interface UserListQuery {
  getUserConnection: UserListQuery_getUserConnection;
}

export interface UserListQueryVariables {
  first?: number | null;
  after?: string | null;
}
