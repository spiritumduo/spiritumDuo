/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { DefaultLayout } from 'components/PageLayout.stories';
import { PageLayoutProps } from 'components/PageLayout';
import DecisionPointPage from './DecisionPoint';

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  patient: {
    id: 5,
    patientHospitalNumber: 'MRN9876543',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date('01/01/1970'),
  },
};
