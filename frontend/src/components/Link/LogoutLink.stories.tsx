/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import LogoutLink from './LogoutLink';

export default {
  title: 'Logout Link',
  component: LogoutLink,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof LogoutLink>;

const Template: ComponentStory<typeof LogoutLink> = (args) => <LogoutLink { ...args } />;

export const Default = Template.bind({});
Default.args = { name: 'John Smith' };
