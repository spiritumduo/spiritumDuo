/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { DocumentNode } from 'graphql';
import { RequestHandler } from 'mock-apollo-client';
import { ClinicalRequestState } from '__generated__/globalTypes';
import { BrowserRouter } from 'react-router-dom';

import {
  getPatientOnPathwayConnectionForGrp,
  getPatientOnPathwayConnectionForGrpVariables,
  getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node as PatientNode,
  getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges as PatientEdge,
} from './__generated__/getPatientOnPathwayConnectionForGrp';
import PatientPathwayList, { GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from './PatientPathwayList';

const totalCount = 12;

const mockPatient: (id: string) => PatientNode = (id) => ({
  __typename: 'Patient',
  id: id,
  firstName: 'John',
  lastName: `Doe ${id}`,
  dateOfBirth: new Date('1970-10-31'),
  hospitalNumber: 'fMRN1234567',
  nationalNumber: 'fNHS1234567890',
  onPathways: [{
    __typename: 'OnPathway',
    id: '1',
    referredAt: new Date('2021-08-14'),
    clinicalRequests: [
      {
        __typename: 'ClinicalRequest',
        id: '1',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '1', name: 'CT-Thorax' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-16'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '2',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '2', name: 'X-Ray' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-20'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '3',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '3', name: 'Lung Function' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-15'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '4',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '4', name: 'CT-Thorax' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-08-30'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '5',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '5', name: 'MRI-Head' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-09-02'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '6',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '6', name: 'EBUS' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-09-04'),
        currentState: ClinicalRequestState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'ClinicalRequest',
        id: '7',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '7', name: 'CT-Thorax' },
        addedAt: new Date('2021-09-10'),
        updatedAt: new Date('2021-09-10'),
        currentState: ClinicalRequestState.WAITING,
        forwardDecisionPoint: null,
      },
      {
        __typename: 'ClinicalRequest',
        id: '8',
        clinicalRequestType: { __typename: 'ClinicalRequestType', id: '8', name: 'Bloods' },
        addedAt: new Date('2021-09-10'),
        updatedAt: new Date('2021-09-10'),
        currentState: ClinicalRequestState.WAITING,
        forwardDecisionPoint: null,
      },
    ],
  }],
});

// eslint-disable-next-line max-len, camelcase
const mockPatientEdges: PatientEdge[] = [];
for (let i = 1; i <= totalCount; i += 1) {
  // eslint-disable-next-line camelcase
  const edge: PatientEdge = {
    __typename: 'PatientEdge',
    cursor: i.toString(),
    node: mockPatient(i.toString()),
  };
  mockPatientEdges.push(edge);
}

const apolloMock: {
  query: DocumentNode,
  mockFn: RequestHandler<
    getPatientOnPathwayConnectionForGrp,
    getPatientOnPathwayConnectionForGrpVariables
  >
}[] = [{
  query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
  mockFn: ({ first, after }) => new Promise((resolve) => {
    const start = after
      ? parseInt(after, 10)
      : 0;
    const end = start + first;
    resolve({ data: {
      getPatientOnPathwayConnection: {
        __typename: 'PatientConnection',
        totalCount: totalCount,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: end < totalCount,
          endCursor: end.toString(),
        },
        edges: mockPatientEdges.slice(start, end),
      },
    } });
  }),
}];

export default {
  title: 'Features/PatientPathwayList',
  component: PatientPathwayList,
  decorators: [(Story) => (
    <NewMockSdApolloProvider mocks={ apolloMock }>
      <BrowserRouter>
        <div style={ { width: '90vw', height: '100vh', minWidth: '300px' } }>
          <Story />
        </div>
      </BrowserRouter>
    </NewMockSdApolloProvider>
  )],
} as ComponentMeta<typeof PatientPathwayList>;

const Template: ComponentStory<typeof PatientPathwayList> = (args) => (
  <PatientPathwayList { ...args } />
);

export const Default = Template.bind({});
Default.args = {
  outstanding: true,
  pathwayId: '1',
  patientsToDisplay: 5,
  underCareOf: false,
  includeDischarged: false,
};
