/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import { DefaultLayout } from 'components/PageLayout.stories';
import { PageLayoutProps } from 'components/PageLayout';
import EditDecisionPointPage, { EditDecisionPointPageProps } from './EditDecisionPoint';

export default {
  title: 'Pages/Decision point: edit',
  component: EditDecisionPointPage,
  decorators: [StoryRouter()],
} as Meta<typeof EditDecisionPointPage>;

const Template: Story<EditDecisionPointPageProps> = (args) => <EditDecisionPointPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  pageLayoutProps: { ...DefaultLayout.args as PageLayoutProps },
  patient: {
    id: 5,
    patientHospitalNumber: 'MRN9876543',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date('01/01/1970'),
  },
};
