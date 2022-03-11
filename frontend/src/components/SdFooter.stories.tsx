/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { MemoryRouter } from 'react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SdFooter from './SdFooter';

export default {
  title: 'components/SdFooter',
  component: SdFooter,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof SdFooter>;

const Template: ComponentStory<typeof SdFooter> = (args) => <SdFooter { ...args } />;

export const Default = Template.bind({});
