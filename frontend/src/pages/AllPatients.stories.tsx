/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { currentPathwayIdVar } from 'app/cache';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Default as WrappedListDefault } from 'components/WrappedPatientList.stories';
import AllPatients, { AllPatientsProps } from 'pages/AllPatients';

const patientsPerPage = 10;

export default {
  title: 'Pages/All Patients',
  component: AllPatients,
  decorators: [
    (AllPatientsStory) => (
      <MemoryRouter>
        <MockAuthProvider>
          <MockPathwayProvider>
            <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
              <AllPatientsStory />
            </PageLayout>
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<typeof AllPatients>;

export const Default: Story<AllPatientsProps> = (args: AllPatientsProps) => {
  currentPathwayIdVar('1');
  return <AllPatients { ...args } />;
};
Default.args = { patientsPerPage: patientsPerPage };
Default.parameters = WrappedListDefault.parameters;
