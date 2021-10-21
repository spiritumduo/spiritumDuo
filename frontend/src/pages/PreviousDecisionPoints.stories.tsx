import PreviousDecisionPoints, { PreviousDecisionPointsProps } from "./PreviousDecisionPoints";
import { HeaderProps } from "../components/Header";
import { Story, Meta } from "@storybook/react";
import Patient from "../types/Patient";
import User from "../types/Users";
import StoryRouter from "storybook-react-router";

export default {
    title: 'Pages/Previous Decision Points',
    component: PreviousDecisionPoints,
    decorators: [ StoryRouter() ]
} as Meta<typeof PreviousDecisionPoints>

const Template: Story<PreviousDecisionPointsProps> = (args: PreviousDecisionPointsProps) => <PreviousDecisionPoints {...args}/>;

const headerProps: HeaderProps = {
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    pathwayOnItemSelect: (name) => console.log(name),
    searchOnSubmit: (e) => {
      e.preventDefault();
      console.log(e);
    }
  }

export const Default = Template.bind({});
Default.args = {
    headerProps: headerProps,
    patient: {
        patientId: "MRN1234567",
        firstName: "John",
        lastName: "Doe",
        dob: new Date(1970-10-10)
    },
    decisions: [
        {
            type: 'Clinic',
            date: new Date('2021-10-17 09:45'),
            doctor: {
                name: "Henry Steer",
                userId: "doctorId"
            },
            history: "CT thorax shows T2N1M0 lung cancer.",
            comorbidities: "Mild COPD",
            requests: "PET-CT: 5cm spiculated mass in right lower lobe, likely lung cancer with single mediastinal node at 1.2 cm"
        },
        {
            type: 'Clinic',
            date: new Date('2021-10-14 12:31'),
            doctor: {
                name: "Henry Steer",
                userId: "doctorId"
            },
            history: "Smoker, 4 month history of cough, weight loss, chest X-ray shows large right lower zone mass",
            comorbidities: "Mild COPD",
            requests: "CT thorax: Smoker, 4 month history of cough, weight loss, chest X-ray shows large right lower zone mass"
        },
        
    ]
}