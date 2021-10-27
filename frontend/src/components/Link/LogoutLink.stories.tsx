/* eslint-disable react/jsx-props-no-spreading */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import React from 'react';
import LogoutLink from './LogoutLink';

export default {
  title: 'Logout Link',
  component: LogoutLink,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof LogoutLink>;

const Template: ComponentStory<typeof LogoutLink> = (args) => <LogoutLink { ...args } />;

export const Default = Template.bind({});
Default.args = { name: 'John Smith' };
