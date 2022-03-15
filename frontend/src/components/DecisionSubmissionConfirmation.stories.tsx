/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DecisionSubmissionConfirmation from 'components/DecisionSubmissionConfirmation';

export default {
  title: 'Components/DecisionSubmissionConfirmation',
  component: DecisionSubmissionConfirmation,
  argTypes: {
    okCallback: { action: 'clicked' },
    cancelCallback: { action: 'clicked' },
  },
} as ComponentMeta<typeof DecisionSubmissionConfirmation>;

const Template: ComponentStory<
  typeof DecisionSubmissionConfirmation
> = (args) => <DecisionSubmissionConfirmation { ...args } />;

export const Default = Template.bind({});

export const WithMilestonesAndConfirmations = Template.bind({});
WithMilestonesAndConfirmations.args = {
  milestones: [
    {
      id: '1',
      name: 'First',
    },
    {
      id: '2',
      name: 'Second',
    },
  ],
  milestoneResolutions: ['First Resolution', 'Second Resolutions'],
};
