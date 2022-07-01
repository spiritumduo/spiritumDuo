/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { DocumentNode } from 'graphql';
import { RequestHandler } from 'mock-apollo-client';
import { MilestoneState } from '__generated__/globalTypes';

import {
  getPatientOnPathwayConnectionForGrp,
  getPatientOnPathwayConnectionForGrpVariables,
  getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges_node as PatientNode,
  getPatientOnPathwayConnectionForGrp_getPatientOnPathwayConnection_edges as PatientEdge,
} from './__generated__/getPatientOnPathwayConnectionForGrp';
import PatientPathwayList, { GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from './PatientPathwayList';

const mockPatient: (id: string) => PatientNode = (id) => ({
  __typename: 'Patient',
  id: id,
  firstName: 'John',
  lastName: `Doe ${id}`,
  dateOfBirth: new Date('1970-10-10'),
  hospitalNumber: 'fMRN1234567',
  nationalNumber: 'fNHS1234567890',
  onPathways: [{
    __typename: 'OnPathway',
    id: '1',
    referredAt: new Date('2021-08-14'),
    milestones: [
      {
        __typename: 'Milestone',
        id: '1',
        milestoneType: { __typename: 'MilestoneType', id: '1', name: 'CT-Thorax' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-16'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'Milestone',
        id: '2',
        milestoneType: { __typename: 'MilestoneType', id: '2', name: 'X-Ray' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-20'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'Milestone',
        id: '3',
        milestoneType: { __typename: 'MilestoneType', id: '3', name: 'Lung Function' },
        addedAt: new Date('2021-08-14'),
        updatedAt: new Date('2021-08-15'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '1',
          addedAt: new Date('2021-08-24'),
        },
      },
      {
        __typename: 'Milestone',
        id: '4',
        milestoneType: { __typename: 'MilestoneType', id: '4', name: 'CT-Thorax' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-08-30'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'Milestone',
        id: '5',
        milestoneType: { __typename: 'MilestoneType', id: '5', name: 'MRI-Head' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-09-02'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'Milestone',
        id: '6',
        milestoneType: { __typename: 'MilestoneType', id: '6', name: 'EBUS' },
        addedAt: new Date('2021-08-24'),
        updatedAt: new Date('2021-09-04'),
        currentState: MilestoneState.COMPLETED,
        forwardDecisionPoint: {
          __typename: 'DecisionPoint',
          id: '2',
          addedAt: new Date('2021-09-06'),
        },
      },
      {
        __typename: 'Milestone',
        id: '7',
        milestoneType: { __typename: 'MilestoneType', id: '7', name: 'CT-Thorax' },
        addedAt: new Date('2021-09-10'),
        updatedAt: new Date('2021-09-10'),
        currentState: MilestoneState.WAITING,
        forwardDecisionPoint: null,
      },
      {
        __typename: 'Milestone',
        id: '8',
        milestoneType: { __typename: 'MilestoneType', id: '8', name: 'Bloods' },
        addedAt: new Date('2021-09-10'),
        updatedAt: new Date('2021-09-10'),
        currentState: MilestoneState.WAITING,
        forwardDecisionPoint: null,
      },
    ],
  }],
});

// eslint-disable-next-line max-len, camelcase
const mockPatientEdges: PatientEdge[] = [];
for (let i = 1; i <= 10; i += 1) {
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
  mockFn: () => Promise.resolve({
    data: {
      getPatientOnPathwayConnection: {
        __typename: 'PatientConnection',
        totalCount: 20,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: true,
          endCursor: '10',
        },
        edges: mockPatientEdges,
      },
    },
  }),
}];

export default {
  title: 'Features/PatientPathwayList',
  component: PatientPathwayList,
  decorators: [(Story) => (
    <NewMockSdApolloProvider mocks={ apolloMock }>
      <div style={ { width: '90vw', height: '100vh', minWidth: '300px' } }>
        <Story />
      </div>
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
  patientsToDisplay: 10,
  underCareOf: false,
  includeDischarged: false,
};
