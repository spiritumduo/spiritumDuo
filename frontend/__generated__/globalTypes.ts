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
  TRIAGE = "TRIAGE",
}

export enum PatientCommunicationMethods {
  EMAIL = "EMAIL",
  LANDLINE = "LANDLINE",
  LETTER = "LETTER",
  MOBILE = "MOBILE",
}

export interface DecisionPointInput {
  patientId: number;
  clinicianId: number;
  pathwayId: number;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities: string;
  requestsReferrals: string;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  communicationMethod?: PatientCommunicationMethods | null;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: any;
  pathway: number;
  awaitingDecisionType?: DecisionType | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
