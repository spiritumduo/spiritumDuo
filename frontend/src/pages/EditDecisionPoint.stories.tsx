/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { DefaultLayout } from 'components/PageLayout.stories';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import EditDecisionPointPage, { EditDecisionPointPageProps } from './EditDecisionPoint';

export default {
  title: 'Pages/Decision point: edit',
  component: EditDecisionPointPage,
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
} as Meta<typeof EditDecisionPointPage>;

const Template: Story<EditDecisionPointPageProps> = (args) => <EditDecisionPointPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  patient: {
    id: '5',
    hospitalNumber: 'MRN9876543',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('01/01/1970'),
  },
};
