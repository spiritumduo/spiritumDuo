/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import { MemoryRouter } from 'react-router';

export default {
  title: 'Components/DecisionSubmissionSuccess',
  component: DecisionSubmissionSuccess,
  decorators: [(DecisionSubmissionSuccessStory) => (
    <MemoryRouter>
      <DecisionSubmissionSuccessStory />
    </MemoryRouter>
  )],
} as ComponentMeta<typeof DecisionSubmissionSuccess>;

const Template: ComponentStory<
  typeof DecisionSubmissionSuccess
> = (args) => <DecisionSubmissionSuccess { ...args } />;

export const Default = Template.bind({});

export const WithClinicalRequestsAndConfirmations = Template.bind({});
WithClinicalRequestsAndConfirmations.args = {
  clinicalRequests: [
    {
      id: '1',
      name: 'First',
    },
    {
      id: '2',
      name: 'Second',
    },
  ],
  clinicalRequestResolutions: ['First Resolution', 'Second Resolutions'],
};
