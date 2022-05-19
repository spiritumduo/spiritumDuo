/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LoadingSpinner from 'components/LoadingSpinner';
import { MemoryRouter } from 'react-router';

export default {
  title: 'Components/Loading Spinner',
  component: LoadingSpinner,
  decorators: [(LoadingSpinnerStory) => (
    <MemoryRouter>
      <LoadingSpinnerStory />
    </MemoryRouter>
  )],
} as ComponentMeta<typeof LoadingSpinner>;

const DefaultTemplate: ComponentStory<
  typeof LoadingSpinner
> = (args) => <LoadingSpinner { ...args } />;

export const Default = DefaultTemplate.bind({});
