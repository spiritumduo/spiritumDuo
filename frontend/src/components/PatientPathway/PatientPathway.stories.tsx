/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PatientPathway, { GET_PATIENT_WITH_REFERRALS_QUERY } from 'components/PatientPathway/PatientPathway';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import MockDate from 'test/mocks/mockDate';

import { DocumentNode } from 'graphql';
import { RequestHandler } from 'mock-apollo-client';
import { getPatientWithReferrals } from './__generated__/getPatientWithReferrals';
import { MilestoneState } from '../../__generated__/globalTypes';

const apolloMock: {
  query: DocumentNode,
  mockFn: RequestHandler<getPatientWithReferrals, {hospitalNumber: string}>
}[] = [{
  query: GET_PATIENT_WITH_REFERRALS_QUERY,
  mockFn: () => Promise.resolve({
    data: {
      getPatient: {
        __typename: 'Patient',
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1970-10-10'),
        hospitalNumber: 'fMRN1234567',
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
              milestoneType: { __typename: 'MilestoneType', id: '6', name: 'CT-Thorax' },
              addedAt: new Date('2021-09-10'),
              updatedAt: new Date('2021-09-10'),
              currentState: MilestoneState.WAITING,
              forwardDecisionPoint: null,
            },
          ],
        }],
      },
    },
  }),
}];

export default {
  title: 'Components/PatientPathway',
  component: PatientPathway,
  decorators: [(Story) => (
    <MockDate date="2021-09-20">
      <NewMockSdApolloProvider mocks={ apolloMock }>
        <div style={ { width: '95vw', height: '500px' } }>
          <Story />
        </div>
      </NewMockSdApolloProvider>
    </MockDate>
  )],
} as ComponentMeta<typeof PatientPathway>;

const Template: ComponentStory<typeof PatientPathway> = (args) => <PatientPathway { ...args } />;

export const Default = Template.bind({});
Default.args = {
  hospitalNumber: 'fMRN1234567',
  showName: true,
};

Default.parameters = {
  mocks: apolloMock,
};

export const WithoutName = Template.bind({});
WithoutName.args = {
  hospitalNumber: 'fMRN1234567',
  showName: false,
};
