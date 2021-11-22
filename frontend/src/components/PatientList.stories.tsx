/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import StoryRouter from 'storybook-react-router';
import PatientList, { PatientListProps } from './PatientList';
import Patient from '../types/Patient';

const patientArray: Patient[] = [];
const patient = {
  id: 2,
  hospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
  dob: new Date('1960-10-10'),
};

for (let i = 0; i < 150; ++i) {
  const newPatient = {
    id: i,
    humber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: patient.firstName,
    lastName: `${patient.lastName} ${i + 1}`,
  };
  patientArray.push(newPatient);
}

const patientsPerPage = 10;

export default {
  title: 'Components/Patient List',
  component: PatientList,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof PatientList>;
// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PatientList> = ({ pageCount, isLoading, ...args }: PatientListProps) => {
  const [{ data }, updateArgs] = useArgs();
  const updateData = (selectedItem: { selected: number; }) => {
    const start = selectedItem.selected * patientsPerPage;
    const end = start + patientsPerPage;
    const newData: Patient[] = patientArray.slice(start, end);
    updateArgs({ data: newData });
  };
  return (
    <PatientList
      { ...args }
      pageCount={ pageCount }
      data={ data }
      isLoading={ isLoading }
      updateData={ updateData }
    />
  );
};

const data: Patient[] = patientArray.slice(0, patientsPerPage);
const pageCount = patientArray.length / patientsPerPage;

export const Default = Template.bind({});
Default.args = {
  pageCount: pageCount,
  data: data,
};
