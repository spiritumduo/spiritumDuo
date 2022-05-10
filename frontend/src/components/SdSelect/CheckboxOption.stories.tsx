/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SdSelectContextProvider } from 'components/SdSelect/SdSelectContext';
import CheckboxOption from './CheckboxOption';

export default {
  title: 'components/CheckboxOption',
  component: CheckboxOption,
  decorators: [
    (CheckboxOptionStory) => (
      <SdSelectContextProvider>
        <CheckboxOptionStory />
      </SdSelectContextProvider>
    ),
  ],
} as ComponentMeta<typeof CheckboxOption>;

const Template: ComponentStory<typeof CheckboxOption> = (args) => <CheckboxOption { ...args } />;

export const Default = Template.bind({});
Default.args = {
  value: 'test-value',
  label: 'Checkbox Input',
};
