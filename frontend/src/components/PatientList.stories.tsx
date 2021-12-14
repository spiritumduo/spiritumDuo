/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { PatientLink } from 'components/Link';
import { MemoryRouter } from 'react-router-dom';
import Patient from 'types/Patient';
import PatientList, { PatientListProps } from './PatientList';

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
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: patient.firstName,
    lastName: `${patient.lastName} ${i + 1}`,
  };
  patientArray.push(newPatient);
}

const patientsPerPage = 10;

export default {
  title: 'Components/Patient List',
  component: PatientList,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PatientList>;
// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PatientList> = ({ pageCount, isLoading, ...args }: PatientListProps) => {
  const [{ data }, updateArgs] = useArgs();
  const updateData = (selectedItem: { selected: number; }) => {
    const start = selectedItem.selected * patientsPerPage;
    const end = start + patientsPerPage;
    const newData: JSX.Element[] = patientArray.slice(start, end).map(
      (n) => <PatientLink key={ n.id } patient={ n } />,
    );
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

const data: JSX.Element[] = patientArray.slice(0, patientsPerPage).map(
  (n) => <PatientLink key={ n.id } patient={ n } />,
);
const pageCount = patientArray.length / patientsPerPage;

export const Default = Template.bind({});
Default.args = {
  pageCount: pageCount,
  data: data,
};
