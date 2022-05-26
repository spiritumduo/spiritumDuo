import React from 'react';
import { Meta, ComponentStory } from '@storybook/react';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import PreviousDecisionPoints, { PREVIOUS_DECISION_POINTS_QUERY } from './PreviousDecisionPoints';

const patient = {
  id: '1',
  hospitalNumber: 'MRN123456',
  firstName: 'John',
  lastName: 'Doe',
};

const decisionPoints = [
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
];

const GET_PATIENT_MOCK = {
  query: PREVIOUS_DECISION_POINTS_QUERY,
  mockFn: () => Promise.resolve({
    data: {
      getPatient: {
        onPathways: [
          {
            id: '1',
            decisionPoints: decisionPoints,
          },
        ],
      },
    },
  }),
};

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

export const Default: ComponentStory<typeof PreviousDecisionPoints> = () => (
  <NewMockSdApolloProvider
    mocks={
      [GET_PATIENT_MOCK]
    }
  >
    <PreviousDecisionPoints
      hospitalNumber={ patient.hospitalNumber }
    />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  getPatientMock: GET_PATIENT_MOCK,
  decisionPoints: decisionPoints,
};

Default.args = {
  hospitalNumber: patient.hospitalNumber,
};
