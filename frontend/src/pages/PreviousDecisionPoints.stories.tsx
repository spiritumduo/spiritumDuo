/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import PreviousDecisionPoints, { PreviousDecisionPointsProps, PREVIOUS_DECISION_POINTS_QUERY } from './PreviousDecisionPoints';

const patient = {
  id: '2',
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
        pathwayId: '1',
        limit: 5,
        includeDischarged: true,
      },
    },
    result: {
      data: {
        getPatient: {
          onPathways: [
            {
              id: '1',
              decisionPoints: [
                {
                  id: '27',
                  decisionType: 'TRIAGE',
                  clinicHistory: '27 TRIAGE clinicHistory Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  comorbidities: '27 TRIAGE comorbidities Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  clinician: {
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  addedAt: '2021-12-02T13:42:25.129062',
                  updatedAt: '2021-12-02T13:42:25.129062',
                  milestones: [
                    {
                      id: '1',
                      currentState: 'COMPLETED',
                      milestoneType: {
                        name: 'X-Ray',
                      },
                    },
                    {
                      id: '2',
                      currentState: 'WAITING',
                      milestoneType: {
                        name: 'MRI Head',
                      },
                    },
                    {
                      id: '3',
                      currentState: 'WAITING',
                      milestoneType: {
                        name: 'Bronchoscopy',
                      },
                    },
                  ],
                },
                {
                  id: '28',
                  decisionType: 'CLINIC',
                  clinicHistory: '28 CLINIC clinicHistory Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  comorbidities: '28 CLINIC comorbidities Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  clinician: {
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  addedAt: '2021-12-02T13:42:25.132480',
                  updatedAt: '2021-12-02T13:42:25.132480',
                  milestones: [
                    {
                      id: '4',
                      currentState: 'COMPLETED',
                      milestoneType: {
                        name: 'X-Ray',
                      },
                    },
                    {
                      id: '5',
                      currentState: 'WAITING',
                      milestoneType: {
                        name: 'MRI Head',
                      },
                    },
                  ],
                },
                {
                  id: '29',
                  decisionType: 'MDT',
                  clinicHistory: '29 MDT clinicHistory Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  comorbidities: '29 MDT comorbidities Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
                  clinician: {
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  addedAt: '2021-12-02T13:42:25.135691',
                  updatedAt: '2021-12-02T13:42:25.135691',
                  milestones: [
                    {
                      id: '6',
                      currentState: 'COMPLETED',
                      milestoneType: {
                        name: 'X-Ray',
                      },
                    },
                    {
                      id: '7',
                      currentState: 'COMPLETED',
                      milestoneType: {
                        name: 'Bronchoscopy',
                      },
                    },
                  ],
                },
              ],
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
      <MockPathwayProvider>
        <DecisionPointPageStory />
      </MockPathwayProvider>
    ),
  ],
} as Meta<typeof PreviousDecisionPoints>;

// eslint-disable-next-line max-len
const Template: Story<PreviousDecisionPointsProps> = (args: PreviousDecisionPointsProps) => <PreviousDecisionPoints { ...args } />;

export const Default = Template.bind({});
Default.args = {
  hospitalNumber: patient.hospitalNumber,
};

Default.parameters = {
  apolloClient: {
    mocks: apolloMocks,
  },
};
