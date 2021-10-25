import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import PatientList, { PatientListProps }  from './PatientList';
import StoryRouter from 'storybook-react-router';
import Patient from '../types/Patient';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Patient List',
  component: PatientList,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof PatientList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: Story<PatientListProps> = (args) => <PatientList {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const patientArray: Patient[] = [];
const patient = {
    id: 2,
    patientHospitalNumber: "MRN1234567",
    firstName: "John",
    lastName:"Doe",
    dob: new Date("1960-10-10")
  }

for (let i = 0; i < 50; ++i) {
    const newPatient = {
        id: i,
        patientHospitalNumber: patient.patientHospitalNumber + `-${i + 1}`,
        firstName: patient.firstName,
        lastName: +patient.lastName + ` ${i + 1}`
    }
    patientArray.push(newPatient);
}

const updateFn = function (offset: number, limit: number) {
    const data: Patient[] = patientArray.slice(offset, limit);
    return { data: data, totalCount: patientArray.length };
}

Default.args = {
    pageLimit: 10,
    totalCount: patientArray.length,
    updateData: updateFn
};
