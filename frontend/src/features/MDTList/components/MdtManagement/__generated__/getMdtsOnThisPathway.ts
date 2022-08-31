/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMdtsOnThisPathway
// ====================================================

export interface getMdtsOnThisPathway_getMdts_clinicians {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface getMdtsOnThisPathway_getMdts_patients {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
}

export interface getMdtsOnThisPathway_getMdts {
  __typename: "MDT";
  id: string;
  clinicians: (getMdtsOnThisPathway_getMdts_clinicians | null)[];
  patients: (getMdtsOnThisPathway_getMdts_patients | null)[];
  createdAt: any;
  plannedAt: any;
  updatedAt: any;
  location: string;
}

export interface getMdtsOnThisPathway {
  getMdts: (getMdtsOnThisPathway_getMdts | null)[];
}

export interface getMdtsOnThisPathwayVariables {
  pathwayId: string;
}
