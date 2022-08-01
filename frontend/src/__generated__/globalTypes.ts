/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ClinicalRequestState {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
  INIT = "INIT",
  WAITING = "WAITING",
}

export enum DecisionType {
  AD_HOC = "AD_HOC",
  CLINIC = "CLINIC",
  FOLLOW_UP = "FOLLOW_UP",
  MDT = "MDT",
  POST_REQUEST = "POST_REQUEST",
  TRIAGE = "TRIAGE",
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

export interface AddPatientToMdtInput {
  id: string;
  reason: string;
}

export interface ClinicalRequestRequestInput {
  clinicalRequestTypeId: string;
  currentState?: ClinicalRequestState | null;
}

export interface ClinicalRequestTypeInput {
  id: string;
}

export interface DecisionPointInput {
  onPathwayId: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities?: string | null;
  clinicalRequestRequests?: ClinicalRequestRequestInput[] | null;
  clinicalRequestResolutions?: string[] | null;
  mdt?: AddPatientToMdtInput | null;
}

export interface FeedbackInput {
  screenshotBase64: string;
  feedback: string;
}

export interface LockOnPathwayInput {
  onPathwayId: string;
  unlock?: boolean | null;
}

export interface MdtInput {
  pathwayId: string;
  plannedAt: any;
  location: string;
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

export interface UpdateMdtInput {
  id: string;
  plannedAt: any;
  location: string;
  users: (string | null)[];
}

export interface UpdateOnMdtInput {
  id: string;
  reason?: string | null;
  outcome?: string | null;
  actioned?: boolean | null;
  order?: number | null;
}

export interface UpdateOnMdtListInput {
  onMdtList?: UpdateOnMdtInput[] | null;
}

export interface UpdatePathwayInput {
  id: string;
  name: string;
  clinicalRequestTypes?: ClinicalRequestTypeInput[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
