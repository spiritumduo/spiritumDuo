import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LogoutLink  from './LogoutLink';
import StoryRouter from 'storybook-react-router';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Logout Link',
  component: LogoutLink,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof LogoutLink>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LogoutLink> = (args) => <LogoutLink {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
    name: "John Smith"
};
