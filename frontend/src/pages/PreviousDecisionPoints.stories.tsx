import React from "react";
import PreviousDecisionPoints, { PreviousDecisionPointsProps } from "./PreviousDecisionPoints";
import { HeaderProps } from "../components/Header";
import { Story, Meta } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import { DecisionPointType }  from "../types/DecisionPoint";

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

const user = {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    department: "Respiratory",
    roles: [{ id: 1, name: "Test Role" }]
}

const patient = {
    id: 2,
    patientHospitalNumber:"MRN0123456",
    firstName:"John",
    lastName:"Doe"
}

export const Default = Template.bind({});
Default.args = {
    headerProps: headerProps,
    patient: {
        id: 2,
        patientHospitalNumber: "MRN1234567",
        firstName: "John",
        lastName:"Doe",
        dob: new Date("1960-10-10")
      },
    decisions: [
        {
            id: 1,
            patient: patient,
            decisionType: DecisionPointType.CLINIC,
            addedAt: new Date('2021-10-17 09:45'),
            clinician: user,
            clinicHistory: "CT thorax shows T2N1M0 lung cancer.",
            comorbidities: "Mild COPD",
            requestsReferrals: "PET-CT: 5cm spiculated mass in right lower lobe, likely lung cancer with single mediastinal node at 1.2 cm"
        },
        {
            id: 2,
            patient: patient,
            decisionType: DecisionPointType.CLINIC,
            addedAt: new Date('2021-10-14 12:31'),
            clinician: user,
            clinicHistory: "Smoker, 4 month history of cough, weight loss, chest X-ray shows large right lower zone mass",
            comorbidities: "Mild COPD",
            requestsReferrals: "CT thorax: Smoker, 4 month history of cough, weight loss, chest X-ray shows large right lower zone mass"
        },
        
    ]
}