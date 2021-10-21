import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Header from './Header';
import StoryRouter from 'storybook-react-router';

export default {
  title: 'Header',
  component: Header,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Standard = Template.bind({});
Standard.args = {
  pathwayOptions: ["Lung cancer", "Bronchieactasis"],
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
    console.log(e); // is there some kind of storybook method to make this appear in actions?
  }
}

/**
 * Header with patient data underneath
 */
export const Patient = Template.bind({});
Patient.args = {
  pathwayOptions: ["Lung cancer", "Bronchieactasis"],
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
    console.log(e); // is there some kind of storybook method to make this appear in actions?
  },
  patient: {
    patientId: "MRN1234567",
    firstName: "John",
    lastName:"Doe",
    dob: new Date("2021-10-10")
  }
}