import PatientPage, { PatientPageProps } from "./Patient";
import { Story, Meta } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import { actions } from '@storybook/addon-actions';
import React from "react";

export default {
    title: 'Pages/Patient',
    component: PatientPage,
    decorators: [ StoryRouter() ]
} as Meta<typeof PatientPage>

const Template: Story<PatientPageProps> = (args: PatientPageProps) => <PatientPage {...args} />;

const patient = {
    id: 2,
    patientHospitalNumber:"MRN0123456",
    firstName: "John",
    lastName:"Doe",
    patientId: "MRN1234567",
    dob: new Date("1942-11-25")
}

export const Default = Template.bind({});
Default.args = {
    user: {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        department: "Respiratory",
        roles: []
    },
    headerProps: {
        patient: patient,
        pathwayOptions: ["Lung cancer", "Bronchieactasis"],
        pathwayOnItemSelect: (name: string) => console.log(name),
        searchOnSubmit: (e: React.FormEvent<EventTarget>) => {
            e.preventDefault();
            actions('grr');
            console.log(e);
        }
    },
    patient: patient,
    decisions: [
        {
            date: new Date('2021-10-17'),
            decision: 'Clinic'
        },
        {
            date: new Date('2021-10-01'),
            decision: 'MDT'
        },
        {
            date: new Date('2021-11-09'),
            decision: 'Follow Up'
        }
    ],
    notes: [
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer",
            note: "Called back, patient says unwell, stayed at home"
        },
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer",
            note: "Called back, patient says unwell, stayed at home"
        },
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer",
            note: "Called back, patient says unwell, stayed at home"
        },
    ],
    messages: [
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer to Tony Tottle",
            note: "Tony, have you looked at that nodule yet?"
        },
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer to Tony Tottle",
            note: "Tony, have you looked at that nodule yet?"
        },
        {
            date: new Date('2021-07-11'),
            enteredBy: "Henry Steer to Tony Tottle",
            note: "Tony, have you looked at that nodule yet?"
        },
    ]
}