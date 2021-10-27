/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import Patient from 'types/Patient';
import { DefaultLayout } from 'components/PageLayout.stories';
import { PageLayoutProps } from 'components/PageLayout';
import HomePage, { HomePageProps } from './HomePage';

export default {
  title: 'Pages/Home Page',
  component: HomePage,
  decorators: [StoryRouter()],
} as Meta<typeof HomePage>;

const Template: Story<HomePageProps> = (args: HomePageProps) => <HomePage { ...args } />;

// Dummy data for display
const patientArray: Patient[] = [];
const patient = {
  patientHospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
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

const dataCallback = (offset: number, limit: number) => {
  const data: Patient[] = patientArray.slice(offset, limit);
  return { data: data, totalCount: patientArray.length };
};

export const Default = Template.bind({});
Default.args = {
  pageLayoutProps: { ...DefaultLayout.args as PageLayoutProps },
  triageData: dataCallback,
  clinicData: dataCallback,
  clinicPatients: patientArray,
  triagePatients: patientArray,
  patientsPerPage: 10,
};
