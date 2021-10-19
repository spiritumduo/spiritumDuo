import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LoginPage } from './Login';

export default {
  title: 'Pages/Login',
  component: LoginPage,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof LoginPage>;

const Template: ComponentStory<typeof LoginPage> = (args) => <LoginPage {...args} />;

export const Standard = Template.bind({});