/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import NewPatientPage from './NewPatient';

export default {
  title: 'Pages/New Patient',
  component: NewPatientPage,
  decorators: [
    (NewPatientStory) => (
      <MockedProvider>
        <NewPatientStory />
      </MockedProvider>
    ),
  ],
} as Meta<typeof NewPatientPage>;

// eslint-disable-next-line max-len
const Template: Story = () => <NewPatientPage />;

export const Standard = Template.bind({});
Standard.args = {};
