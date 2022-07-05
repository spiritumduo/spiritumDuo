/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: notificationSubscription
// ====================================================

export interface notificationSubscription_clinicalRequestResolved_clinicalRequestType {
  __typename: "ClinicalRequestType";
  name: string;
}

export interface notificationSubscription_clinicalRequestResolved_onPathway_patient {
  __typename: "Patient";
  firstName: string;
  lastName: string;
}

export interface notificationSubscription_clinicalRequestResolved_onPathway {
  __typename: "OnPathway";
  patient: notificationSubscription_clinicalRequestResolved_onPathway_patient;
}

export interface notificationSubscription_clinicalRequestResolved {
  __typename: "ClinicalRequest";
  id: string;
  clinicalRequestType: notificationSubscription_clinicalRequestResolved_clinicalRequestType;
  onPathway: notificationSubscription_clinicalRequestResolved_onPathway;
}

export interface notificationSubscription {
  clinicalRequestResolved: notificationSubscription_clinicalRequestResolved;
}
