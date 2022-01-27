/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { currentPathwayIdVar } from 'app/cache';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Default as WrappedListDefault } from 'components/WrappedPatientList.stories';
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
  currentPathwayIdVar(1);
  return <HomePage { ...args } />;
};
Default.args = { patientsPerPage: patientsPerPage };
Default.parameters = WrappedListDefault.parameters;
