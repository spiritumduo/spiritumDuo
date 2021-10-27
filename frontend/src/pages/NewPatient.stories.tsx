/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import { DefaultLayout } from 'components/PageLayout.stories';
import { PageLayoutProps } from 'components/PageLayout';
import NewPatientPage, { NewPatientPageProps } from './NewPatient';

export default {
  title: 'Pages/New Patient',
  component: NewPatientPage,
  decorators: [StoryRouter()],
} as Meta<typeof NewPatientPage>;

// eslint-disable-next-line max-len
const Template: Story<NewPatientPageProps> = (args: NewPatientPageProps) => <NewPatientPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = { pageLayoutProps: { ...DefaultLayout.args as PageLayoutProps } };
