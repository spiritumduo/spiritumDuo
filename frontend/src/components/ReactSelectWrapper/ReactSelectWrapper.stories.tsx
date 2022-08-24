import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import ReactSelectWrapper from './ReactSelectWrapper';

export default {
  title: 'components/React Select Wrapper',
  component: ReactSelectWrapper,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ReactSelectWrapper>;

// eslint-disable-next-line react/jsx-props-no-spreading
const Template: ComponentStory<typeof ReactSelectWrapper> = (a) => <ReactSelectWrapper { ...a } />;

export const Default = Template.bind({});
Default.args = {
  isMulti: true,
  isClearable: true,
  options: [
    { label: 'test1', value: 'test1' },
    { label: 'test2', value: 'test2' },
    { label: 'test3', value: 'test3' },
    { label: 'test4', value: 'test4' },
    { label: 'test5', value: 'test5' },
  ],
};
