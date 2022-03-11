/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import PatientLink from './PatientLink';

export default {
  title: 'components/Patient Link',
  component: PatientLink,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PatientLink>;

const Template: ComponentStory<typeof PatientLink> = (args) => <PatientLink { ...args } />;

export const Default = Template.bind({});
Default.args = {
  patient: {
    id: '2',
    hospitalNumber: 'MRN0123456',
    firstName: 'John',
    lastName: 'Doe',
  },
};
