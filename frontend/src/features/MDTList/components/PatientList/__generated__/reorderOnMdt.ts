/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateOnMdtListInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: reorderOnMdt
// ====================================================

export interface reorderOnMdt_updateOnMdtList_onMdtList {
  __typename: "OnMdt";
  id: string;
  order: number;
}

export interface reorderOnMdt_updateOnMdtList {
  __typename: "OnMdtListPayload";
  onMdtList: reorderOnMdt_updateOnMdtList_onMdtList[] | null;
}

export interface reorderOnMdt {
  updateOnMdtList: reorderOnMdt_updateOnMdtList;
}

export interface reorderOnMdtVariables {
  input: UpdateOnMdtListInput;
}
