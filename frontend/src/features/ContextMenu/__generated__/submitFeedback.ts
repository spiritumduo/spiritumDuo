/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeedbackInput } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: submitFeedback
// ====================================================

export interface submitFeedback_submitFeedback {
  __typename: "SubmitFeedbackPayload";
  success: boolean;
}

export interface submitFeedback {
  submitFeedback: submitFeedback_submitFeedback;
}

export interface submitFeedbackVariables {
  input: FeedbackInput;
}
