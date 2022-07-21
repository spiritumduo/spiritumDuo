/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPathways
// ====================================================

export interface getPathways_getPathways_clinicalRequestTypes {
  __typename: "ClinicalRequestType";
  id: string;
  name: string;
  refName: string;
}

export interface getPathways_getPathways {
  __typename: "Pathway";
  id: string;
  name: string;
  clinicalRequestTypes: getPathways_getPathways_clinicalRequestTypes[] | null;
}

export interface getPathways {
  getPathways: (getPathways_getPathways | null)[] | null;
}
