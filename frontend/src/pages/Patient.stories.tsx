import PatientPage from "./Patient";
import { Story, Meta } from "@storybook/react";
import StoryRouter from "storybook-react-router";

export default {
    title: 'Pages/Patient',
    component: PatientPage,
    decorators: [ StoryRouter() ]
} as Meta<typeof PatientPage>

const Template: Story<typeof PatientPage> = (args) => <PatientPage {...args} />;

const patient = {
    name: "John Doe",
    patientId: "MRN1234567",
    dob: "25/11/1942"
}

export const Default = Template.bind({});
Default.args = {
    user: {
        name: "John Smith"
    },
    headerProps: {
        patient: patient,
        pathwayOptions: ["Lung cancer", "Bronchieactasis"],
        pathwayOnItemSelect: (name: string) => console.log(name),
        searchOnSubmit: (e) => {
            e.preventDefault();
            console.log(e); // is there some kind of storybook method to make this appear in actions?
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