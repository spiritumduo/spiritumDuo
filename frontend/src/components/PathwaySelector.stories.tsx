/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import PathwaySelector from './PathwaySelector';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Pathway Selector',
  component: PathwaySelector,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof PathwaySelector>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PathwaySelector> = (args) => <PathwaySelector { ...args } />;

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  options: ['Lung cancer', 'Bronchieactasis'],
  currentOption: 'Lung cancer',
};
