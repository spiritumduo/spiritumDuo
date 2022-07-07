/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsOnMdtConnectionQuery
// ====================================================

export interface getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_edges_node {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
}

export interface getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_edges {
  __typename: "PatientEdge";
  cursor: string;
  node: getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_edges_node;
}

export interface getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection {
  __typename: "PatientsOnMdtConnection";
  totalCount: number;
  pageInfo: getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_pageInfo;
  edges: getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection_edges[];
}

export interface getPatientsOnMdtConnectionQuery {
  getPatientsOnMdtConnection: getPatientsOnMdtConnectionQuery_getPatientsOnMdtConnection;
}

export interface getPatientsOnMdtConnectionQueryVariables {
  first?: number | null;
  after?: string | null;
  id: string;
}
