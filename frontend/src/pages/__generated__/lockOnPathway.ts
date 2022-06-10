/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LockOnPathwayInput } from "../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: lockOnPathway
// ====================================================

export interface lockOnPathway_lockOnPathway_onPathway_lockUser {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface lockOnPathway_lockOnPathway_onPathway {
  __typename: "OnPathway";
  id: string;
  lockUser: lockOnPathway_lockOnPathway_onPathway_lockUser | null;
  lockEndTime: any | null;
}

export interface lockOnPathway_lockOnPathway_userErrors {
  __typename: "UserError";
  field: string;
  message: string;
}

export interface lockOnPathway_lockOnPathway {
  __typename: "LockOnPathwayPayload";
  onPathway: lockOnPathway_lockOnPathway_onPathway | null;
  userErrors: lockOnPathway_lockOnPathway_userErrors[] | null;
}

export interface lockOnPathway {
  lockOnPathway: lockOnPathway_lockOnPathway;
}

export interface lockOnPathwayVariables {
  input: LockOnPathwayInput;
}
