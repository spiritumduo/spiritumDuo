/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PathwayOption from 'types/PathwayOption';
import { MemoryRouter } from 'react-router-dom';
import PathwaySelector from './PathwaySelector';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Pathway Selector',
  component: PathwaySelector,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PathwaySelector>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PathwaySelector> = (args) => <PathwaySelector { ...args } />;
const pathways: PathwayOption[] = [
  {
    id: 0,
    name: 'Lung Cancer',
  },
  {
    id: 1,
    name: 'Bronchieactasis',
  },
];

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
  options: pathways,
  currentOption: pathways[0],
};
