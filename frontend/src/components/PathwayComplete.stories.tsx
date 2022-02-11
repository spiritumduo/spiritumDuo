/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PathwayComplete from 'components/PathwayComplete';
import { MemoryRouter } from 'react-router';

export default {
  title: 'Components/PathwayComplete',
  component: PathwayComplete,
  decorators: [(PathwayCompleteStory) => (
    <MemoryRouter>
      <PathwayCompleteStory />
    </MemoryRouter>
  )],
} as ComponentMeta<typeof PathwayComplete>;

const Template: ComponentStory<
  typeof PathwayComplete
> = (args) => <PathwayComplete />;

export const Default = Template.bind({});
