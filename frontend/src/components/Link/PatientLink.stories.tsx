/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import PatientLink from './PatientLink';

export default {
  title: 'Patient Link',
  component: PatientLink,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof PatientLink>;

const Template: ComponentStory<typeof PatientLink> = (args) => <PatientLink { ...args } />;

export const Default = Template.bind({});
Default.args = {
  patient: {
    id: 2,
    patientHospitalNumber: 'MRN0123456',
    firstName: 'John',
    lastName: 'Doe',
  },
};
