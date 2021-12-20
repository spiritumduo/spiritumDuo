/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { DefaultLayout } from 'components/PageLayout.stories';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import DecisionPointPage, { CREATE_DECISION_POINT_MUTATION, GET_PATIENT_QUERY } from './DecisionPoint';

const patientHospitalNumber = 'MRN1234567-36';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apolloMocks = [
  {
    request: {
      query: GET_PATIENT_QUERY,
      variables: {
        hospitalNumber: patientHospitalNumber,
        limit: 1,
      },
    },
    result: {
      data: {
        getPatient: {
          hospitalNumber: 'MRN1234567-36',
          id: '1637',
          communicationMethod: 'LETTER',
          firstName: 'John 36',
          lastName: 'Doe 36',
          dateOfBirth: new Date('1970-06-12'),
          decisionPoints: [
            {
              clinicHistory: 'Clinic History 1',
              comorbidities: 'Comorbidities 1',
            },
            {
              clinicHistory: 'Clinic History 2',
              comorbidities: 'Comorbidities 2',
            },
            {
              clinicHistory: 'Clinic History 3',
              comorbidities: 'Comorbidities 3',
            },
            {
              clinicHistory: 'Clinic History 4',
              comorbidities: 'Comorbidities 4',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_DECISION_POINT_MUTATION,
      variables: {
        input: {
          patientId: '1637',
          pathwayId: '1',
          clinicianId: 1,
          clinicHistory: 'New Clinic History',
          comorbidities: 'New Comorbidities',
          decisionType: DecisionPointType.TRIAGE.toString(),
          requestsReferrals: 'Some referrals',
        },
      },
    },
    result: {
      data: {
        createDecisionPoint: {
          id: '1',
        },
      },
    },
  },
];

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [
    (DecisionPointPageStory) => (
      <MemoryRouter>
        <MockAuthProvider>
          <MockPathwayProvider>
            <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
              <DecisionPointPageStory />
            </PageLayout>
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

export const Default = Template.bind({});
Default.args = {
  hospitalNumber: patientHospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
};
Default.parameters = {
  apolloClient: {
    mocks: apolloMocks,
  },
};
