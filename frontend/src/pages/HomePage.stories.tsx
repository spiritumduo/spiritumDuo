/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import Patient from 'types/Patient';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { DecisionPointType } from 'types/DecisionPoint';
import { currentPathwayIdVar } from 'app/cache';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import HomePage, { HomePageProps, GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from './HomePage';

// Dummy data for display
const patientArray: Patient[] = [];
const patient = {
  hospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
};

for (let i = 0; i < 20; ++i) {
  const newPatient = {
    id: i,
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: `${patient.firstName} ${i + 1}`,
    lastName: `${patient.lastName} ${i + 1}`,
    dateOfBirth: new Date('1970-01-01'),
    onPathways: [
      {
        decisionPoints: [
          {
            milestones: [
              {
                id: '1',
                updatedAt: new Date(2020, 1, 5),
                currentState: 'COMPLETED',
                milestoneType: {
                  name: 'Triage',
                },
              },
            ],
          },
        ],
      },
    ],
  };
  patientArray.push(newPatient);
}

const edges = patientArray.map((p) => ({
  cursor: `${p.id}YXJyYXljb25uZWN0aW9uOjA=`,
  node: p,
}));
const patientsPerPage = 10;

export default {
  title: 'Pages/Home Page',
  component: HomePage,
  decorators: [
    (HomePageStory) => (
      <MemoryRouter>
        <MockAuthProvider>
          <MockPathwayProvider>
            <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
              <HomePageStory />
            </PageLayout>
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<typeof HomePage>;

export const Default: Story<HomePageProps> = (args: HomePageProps) => {
  currentPathwayIdVar(1);
  return <HomePage { ...args } />;
};
Default.args = { patientsPerPage: patientsPerPage };
Default.parameters = {
  patients: patientArray,
  apolloClient: {
    mocks: [
      { // PAGE 1
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            awaitingDecisionType: DecisionPointType.TRIAGE,
          },
        },
        result: {
          data: {
            getPatientOnPathwayConnection: {
              totalCount: edges.length,
              edges: edges.slice(0, patientsPerPage),
              pageInfo: {
                hasNextPage: true,
                endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              },
            },
          },
        },
      },
      { // PAGE 2
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            awaitingDecisionType: DecisionPointType.TRIAGE,
            after: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
        result: {
          data: {
            getPatientOnPathwayConnection: {
              totalCount: edges.length,
              edges: edges.slice(patientsPerPage, patientsPerPage + patientsPerPage),
              pageInfo: {
                hasNextPage: false,
                endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              },
            },
          },
        },
      },
    ],
  },
};
