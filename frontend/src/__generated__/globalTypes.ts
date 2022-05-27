/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum DecisionType {
  AD_HOC = "AD_HOC",
  CLINIC = "CLINIC",
  FOLLOW_UP = "FOLLOW_UP",
  MDT = "MDT",
  POST_REQUEST = "POST_REQUEST",
  TRIAGE = "TRIAGE",
}

export enum MilestoneState {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
  INIT = "INIT",
  WAITING = "WAITING",
}

export enum PatientCommunicationMethods {
  EMAIL = "EMAIL",
  LANDLINE = "LANDLINE",
  LETTER = "LETTER",
  MOBILE = "MOBILE",
}

export interface DecisionPointInput {
  onPathwayId: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities?: string | null;
  milestoneRequests?: MilestoneRequestInput[] | null;
  milestoneResolutions?: string[] | null;
}

export interface LockOnPathwayInput {
  onPathwayId: string;
  unlock?: boolean | null;
}

export interface MilestoneRequestInput {
  milestoneTypeId: string;
  currentState?: MilestoneState | null;
}

export interface MilestoneTypeInput {
  id: string;
}

export interface PathwayInput {
  name: string;
  milestoneTypes?: MilestoneTypeInput[] | null;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  communicationMethod?: PatientCommunicationMethods | null;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
  pathwayId: string;
  awaitingDecisionType?: DecisionType | null;
  referredAt?: any | null;
  milestones?: (MilestoneRequestInput | null)[] | null;
}

export interface UpdatePathwayInput {
  id: string;
  name: string;
  milestoneTypes?: MilestoneTypeInput[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
