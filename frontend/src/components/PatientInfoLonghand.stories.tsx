/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import PatientInfoLonghand from './PatientInfoLonghand';

export default {
  title: 'components/Patient Information (longhand)',
  component: PatientInfoLonghand,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PatientInfoLonghand>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PatientInfoLonghand> = (args) => <PatientInfoLonghand { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  patient: {
    id: 2,
    hospitalNumber: 'MRN1234567',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1960-10-10'),
  },
};
