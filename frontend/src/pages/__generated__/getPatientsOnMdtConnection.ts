/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPatientsOnMdtConnection
// ====================================================

export interface getPatientsOnMdtConnection_getPatientsOnMdtConnection_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string;
}

export interface getPatientsOnMdtConnection_getPatientsOnMdtConnection_edges_node {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
}

export interface getPatientsOnMdtConnection_getPatientsOnMdtConnection_edges {
  __typename: "PatientEdge";
  cursor: string;
  node: getPatientsOnMdtConnection_getPatientsOnMdtConnection_edges_node;
}

export interface getPatientsOnMdtConnection_getPatientsOnMdtConnection {
  __typename: "PatientsOnMdtConnection";
  totalCount: number;
  pageInfo: getPatientsOnMdtConnection_getPatientsOnMdtConnection_pageInfo;
  edges: getPatientsOnMdtConnection_getPatientsOnMdtConnection_edges[];
}

export interface getPatientsOnMdtConnection {
  getPatientsOnMdtConnection: getPatientsOnMdtConnection_getPatientsOnMdtConnection;
}

export interface getPatientsOnMdtConnectionVariables {
  first?: number | null;
  after?: string | null;
  id: string;
}
