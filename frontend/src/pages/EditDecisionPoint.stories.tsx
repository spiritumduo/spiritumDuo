/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import EditDecisionPointPage, { EditDecisionPointPageProps } from './EditDecisionPoint';

export default {
  title: 'Pages/Decision point: edit',
  component: EditDecisionPointPage,
} as Meta<typeof EditDecisionPointPage>;

const Template: Story<EditDecisionPointPageProps> = (args) => <EditDecisionPointPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  patient: {
    id: 5,
    hospitalNumber: 'MRN9876543',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('01/01/1970'),
  },
};
