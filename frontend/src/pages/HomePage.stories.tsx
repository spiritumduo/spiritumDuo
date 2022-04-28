/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { currentPathwayIdVar } from 'app/cache';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Default as WrappedListDefault } from 'components/WrappedPatientList.stories';
import { GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from 'components/WrappedPatientList';
import { Standard } from 'components/Notification.stories';
import HomePage, { HomePageProps } from './HomePage';

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
  currentPathwayIdVar('1');
  return <HomePage { ...args } />;
};

// This is kind of messy, but it lets us reuse this test data without a deep copy
const patientArray = WrappedListDefault.parameters?.patients;
const edges = WrappedListDefault.parameters?.edges;

Default.args = { patientsPerPage: patientsPerPage };
Default.parameters = {
  patients: patientArray,
  apolloClient: {
    mocks: [
      Standard.parameters?.apolloClient.mocks[0], // notification mock
      { // PAGE 1
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            after: undefined,
            outstanding: true,
            underCareOf: true,
            includeDischarged: false,
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
            after: 'YXJyYXljb25uZWN0aW9uOjA=',
            outstanding: true,
            underCareOf: true,
            includeDischarged: false,
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
