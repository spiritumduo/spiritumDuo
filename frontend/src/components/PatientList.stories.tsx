/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { MemoryRouter } from 'react-router-dom';
import { ArrayElement } from 'sdutils';
import PatientList, { PatientListProps } from './PatientList';

const patientArray: PatientListProps['data'] = [];
const patient = {
  id: '2',
  hospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1960-10-10'),
  updatedAt: new Date('2022-01-01'),
  mostRecentStage: 'Some stage',
};

for (let i = 0; i < 150; ++i) {
  const newPatient = {
    id: i.toString(),
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: patient.firstName,
    lastName: `${patient.lastName} ${i + 1}`,
    dateOfBirth: patient.dateOfBirth,
    mostRecentStage: patient.mostRecentStage,
    updatedAt: patient.updatedAt,
    isOnPathwayLockedByOther: i % 2 === 0,
    lockFirstName: i % 2 === 0 ? 'Johnny' : undefined,
    lockLastName: i % 2 === 0 ? 'Locker' : undefined,
  };
  patientArray.push(newPatient);
}

const patientsPerPage = 10;

const patientMapFn = (n: ArrayElement<PatientListProps['data']>) => ({
  id: n.id,
  firstName: n.firstName,
  lastName: n.lastName,
  hospitalNumber: n.hospitalNumber,
  dateOfBirth: n.dateOfBirth,
  updatedAt: n.updatedAt,
  mostRecentStage: n.mostRecentStage,
  isOnPathwayLockedByOther: n.isOnPathwayLockedByOther,
  lockFirstName: n.lockFirstName,
  lockLastName: n.lockLastName,
});

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
    const newData: PatientListProps['data'] = patientArray.slice(start, end).map(patientMapFn);
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

const data: PatientListProps['data'] = patientArray.slice(0, patientsPerPage).map(patientMapFn);
const pageCount = patientArray.length / patientsPerPage;

export const Default = Template.bind({});
Default.args = {
  pageCount: pageCount,
  data: data,
};
