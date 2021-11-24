/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import PathwayOption from 'types/PathwayOption';
import { pathwayOptionsVar } from 'app/cache';
import Header from './Header';

export default {
  title: 'Header',
  component: Header,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header { ...args } />;

const pathways: PathwayOption[] = [
  {
    id: 0,
    name: 'Lung Cancer',
  },
  {
    id: 1,
    name: 'Bronchieactasis',
  },
];

export const Standard = Template.bind({});
Standard.args = {
  pathwayOptions: pathways,
  currentPathwayId: pathways[0].id,
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
    console.log(e); // is there some kind of storybook method to make this appear in actions?
  },
};

/**
 * Header with patient data underneath
 */
export const Patient = Template.bind({});
Patient.args = {
  pathwayOptions: pathways,
  currentPathwayId: pathways[0].id,
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
    console.log(e); // is there some kind of storybook method to make this appear in actions?
  },
  patient: {
    id: 2,
    hospitalNumber: 'MRN1234567',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1960-10-10'),
  },
};
