import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { DecisionPointPage } from './DecisionPoint';

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof DecisionPointPage>;

const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage {...args} />;

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