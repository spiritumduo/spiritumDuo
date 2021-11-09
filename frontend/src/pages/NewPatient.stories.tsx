/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import NewPatientPage from './NewPatient';

export default {
  title: 'Pages/New Patient',
  component: NewPatientPage,
  decorators: [StoryRouter()],
} as Meta<typeof NewPatientPage>;

// eslint-disable-next-line max-len
const Template: Story = () => <NewPatientPage />;

export const Standard = Template.bind({});
Standard.args = {};
