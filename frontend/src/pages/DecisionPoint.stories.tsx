/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import DecisionPointPage from './DecisionPoint';

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

const patient = {
  id: 5,
  hospitalNumber: 'MRN9876543',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('01/01/1970'),
};

export const Standard = Template.bind({});
Standard.args = {
  hospitalNumber: patient.hospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
};
