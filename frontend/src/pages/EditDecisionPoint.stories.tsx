import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EditDecisionPointPage } from './EditDecisionPoint';

export default {
  title: 'Pages/Decision point: edit',
  component: EditDecisionPointPage,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof EditDecisionPointPage>;

const Template: ComponentStory<typeof EditDecisionPointPage> = (args) => <EditDecisionPointPage {...args} />;

const searchCallback = (e: React.FormEvent<EventTarget>) => {
    console.log(e);
}

const pathwayCallback = (name: string) => {
    console.log(name);
}

export const Standard = Template.bind({});
Standard.args = {
    user: {
        userId: "MRN123467",
        name: "John Doe"
    },
    patient:{
        patientId: "MRN9876543",
        name: "John Doe"
    },
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    pathwayOnItemSelect: pathwayCallback,
    searchOnSubmit: searchCallback,
}