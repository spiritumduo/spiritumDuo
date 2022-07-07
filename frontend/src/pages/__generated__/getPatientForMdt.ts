/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PatientCommunicationMethods } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: getPatientForMdt
// ====================================================

export interface getPatientForMdt_getPatient_address {
  __typename: "Address";
  line: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

export interface getPatientForMdt_getPatient_onMdts {
  __typename: "OnMdt";
  id: string;
}

export interface getPatientForMdt_getPatient {
  __typename: "Patient";
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  telephoneNumber: string | null;
  occupation: string;
  sex: string;
  dateOfBirth: any;
  communicationMethod: PatientCommunicationMethods;
  address: getPatientForMdt_getPatient_address;
  onMdts: (getPatientForMdt_getPatient_onMdts | null)[];
}

export interface getPatientForMdt {
  getPatient: getPatientForMdt_getPatient | null;
}

export interface getPatientForMdtVariables {
  id: string;
  mdtId: string;
}
