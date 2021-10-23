import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NewPatientPage } from './NewPatient';

export default {
  title: 'Pages/New Patient',
  component: NewPatientPage,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof NewPatientPage>;

const Template: ComponentStory<typeof NewPatientPage> = (args) => <NewPatientPage {...args} />;

const searchCallback = (e: React.FormEvent<EventTarget>) => {
    console.log(e);
}

const pathwayCallback = (name: string) => {
    console.log(name);
}

export const Standard = Template.bind({});
Standard.args = {
    user: {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        department: "Respiratory",
        roles: []
    },
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    pathwayOnItemSelect: pathwayCallback,
    searchOnSubmit: searchCallback,
}