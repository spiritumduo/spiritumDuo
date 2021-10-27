/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import PatientInfoLonghand from './PatientInfoLonghand';

export default {
  title: 'Patient Information (longhand)',
  component: PatientInfoLonghand,
} as ComponentMeta<typeof PatientInfoLonghand>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PatientInfoLonghand> = (args) => <PatientInfoLonghand { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  patient: {
    id: 2,
    patientHospitalNumber: 'MRN1234567',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date('1960-10-10'),
  },
};
