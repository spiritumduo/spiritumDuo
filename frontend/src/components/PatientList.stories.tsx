/* eslint-disable react/jsx-props-no-spreading */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import React from 'react';
import PatientList, { PatientListProps } from './PatientList';
import Patient from '../types/Patient';

export default {
  title: 'Components/Patient List',
  component: PatientList,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof PatientList>;
// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PatientList> = (args: PatientListProps) => <PatientList { ...args } />;

const patientArray: Patient[] = [];
const patient = {
  id: 2,
  patientHospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
  dob: new Date('1960-10-10'),
};

for (let i = 0; i < 50; ++i) {
  const newPatient = {
    id: i,
    patientHospitalNumber: `${patient.patientHospitalNumber}-${i + 1}`,
    firstName: patient.firstName,
    lastName: `${patient.lastName} ${i + 1}`,
  };
  patientArray.push(newPatient);
}

const updateFn = (offset: number, limit: number) => {
  const data: Patient[] = patientArray.slice(offset, limit);
  return { data: data, totalCount: patientArray.length };
};

export const Default = Template.bind({});
Default.args = {
  pageLimit: 10,
  totalCount: patientArray.length,
  updateData: updateFn,
};
