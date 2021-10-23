import React from 'react';
import { Story, Meta } from '@storybook/react';
import HomePage, { HomePageProps } from './HomePage';
import StoryRouter from 'storybook-react-router';
import Patient from '../types/Patient';

export default {
    title: 'Pages/Home Page',
    component: HomePage,
    decorators: [ StoryRouter() ]
} as Meta<typeof HomePage>

const Template: Story<HomePageProps> = (args: HomePageProps) => <HomePage {...args} />;

// Dummy data for display
const patientArray: Patient[] = [];
const patient = {
    patientHospitalNumber: "MRN1234567",
    firstName: "John",
    lastName: "Doe"
};

for (let i = 0; i < 50; ++i) {
    const newPatient = {
        id: i,
        patientHospitalNumber: patient.patientHospitalNumber + `-${i + 1}`,
        firstName: patient.firstName,
        lastName: patient.lastName + ` ${i + 1}`
    }
    patientArray.push(newPatient);
}

const dataCallback = (offset: number, limit: number) => {
    const data: Patient[] = patientArray.slice(offset, limit);
    return { data: data, totalCount: patientArray.length };
}

// eslint-disable-next-line no-undef
const searchCallback = (e: React.FormEvent<EventTarget>) => {
    console.log(e);
}

const pathwayCallback = (name: string) => {
    console.log(name);
}

export const Default = Template.bind({});
Default.args = {
    user: {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        department: "Respiratory",
        roles: [{ id: 1, name: "Test Role" }]
    },
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    triageData: dataCallback,
    clinicData: dataCallback,
    pathwayOptionsCallback: pathwayCallback,
    searchCallback: searchCallback,
    clinicPatients: patientArray,
    triagePatients: patientArray,
    patientsPerPage: 10
}