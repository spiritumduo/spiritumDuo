/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: notificationSubscription
// ====================================================

export interface notificationSubscription_milestoneResolved_milestoneType {
  __typename: "MilestoneType";
  name: string;
}

export interface notificationSubscription_milestoneResolved_onPathway_patient {
  __typename: "Patient";
  firstName: string;
  lastName: string;
}

export interface notificationSubscription_milestoneResolved_onPathway {
  __typename: "OnPathway";
  patient: notificationSubscription_milestoneResolved_onPathway_patient;
}

export interface notificationSubscription_milestoneResolved {
  __typename: "Milestone";
  id: string;
  milestoneType: notificationSubscription_milestoneResolved_milestoneType;
  onPathway: notificationSubscription_milestoneResolved_onPathway;
}

export interface notificationSubscription {
  milestoneResolved: notificationSubscription_milestoneResolved;
}
