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

export enum ClinicalRequestState {
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

export enum Sex {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "OTHER",
}

export interface DecisionPointInput {
  onPathwayId: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities?: string | null;
  clinicalRequestRequests?: ClinicalRequestRequestInput[] | null;
  clinicalRequestResolutions?: string[] | null;
}

export interface FeedbackInput {
  screenshotBase64: string;
  feedback: string;
}

export interface LockOnPathwayInput {
  onPathwayId: string;
  unlock?: boolean | null;
}

export interface ClinicalRequestRequestInput {
  clinicalRequestTypeId: string;
  currentState?: ClinicalRequestState | null;
}

export interface ClinicalRequestTypeInput {
  id: string;
}

export interface PathwayInput {
  name: string;
  clinicalRequestTypes?: ClinicalRequestTypeInput[] | null;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  communicationMethod?: PatientCommunicationMethods | null;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
  sex: Sex;
  pathwayId: string;
  awaitingDecisionType?: DecisionType | null;
  referredAt?: any | null;
  clinicalRequests?: (ClinicalRequestRequestInput | null)[] | null;
}

export interface UpdatePathwayInput {
  id: string;
  name: string;
  clinicalRequestTypes?: ClinicalRequestTypeInput[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
