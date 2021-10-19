import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Header } from './Header';
import StoryRouter from 'storybook-react-router';

export default {
  title: 'Header',
  component: Header,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof Header>;



const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Standard = Template.bind({});