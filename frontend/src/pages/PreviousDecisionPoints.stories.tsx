/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import { DecisionPointType } from 'types/DecisionPoint';
import { MockedProvider } from '@apollo/client/testing';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { DefaultLayout } from 'components/PageLayout.stories';
import PreviousDecisionPoints, { PreviousDecisionPointsProps, PREVIOUS_DECISION_POINTS_QUERY } from './PreviousDecisionPoints';

const patient = {
  id: 2,
  hospitalNumber: 'MRN0123456',
  firstName: 'John',
  lastName: 'Doe',
};

const apolloMocks = [
  {
    request: {
      query: PREVIOUS_DECISION_POINTS_QUERY,
      variables: {
        hospitalNumber: patient.hospitalNumber,
        pathwayId: 0,
      },
    },
    result: {
      data: {
        getPatient: {
          decisionPoints: [
            {
              id: '27',
              decisionType: 'MDT',
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              clinician: {
                firstName: 'John',
                lastName: 'Doe',
              },
              addedAt: '2021-12-02T13:42:25.129062',
              updatedAt: '2021-12-02T13:42:25.129062',
              requestsReferrals: '',
            },
            {
              id: '28',
              decisionType: 'MDT',
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              clinician: {
                firstName: 'John',
                lastName: 'Doe',
              },
              addedAt: '2021-12-02T13:42:25.132480',
              updatedAt: '2021-12-02T13:42:25.132480',
              requestsReferrals: '',
            },
            {
              id: '29',
              decisionType: 'MDT',
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              clinician: {
                firstName: 'John',
                lastName: 'Doe',
              },
              addedAt: '2021-12-02T13:42:25.135691',
              updatedAt: '2021-12-02T13:42:25.135691',
              requestsReferrals: '',
            },
          ],
        },
      },
    },
  },
];

export default {
  title: 'Pages/Previous Decision Points',
  component: PreviousDecisionPoints,
  decorators: [
    (DecisionPointPageStory) => (
      <MockedProvider mocks={ apolloMocks }>
        <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
          <DecisionPointPageStory />
        </PageLayout>
      </MockedProvider>
    ),
  ],
} as Meta<typeof PreviousDecisionPoints>;

// eslint-disable-next-line max-len
const Template: Story<PreviousDecisionPointsProps> = (args: PreviousDecisionPointsProps) => <PreviousDecisionPoints { ...args } />;

export const Default = Template.bind({});
Default.args = {
  hospitalNumber: patient.hospitalNumber,
};
