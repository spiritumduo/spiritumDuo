/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AccessibleTable } from 'components/PathwayVisualisation/components/AccessibleTable';
import { mockPatientData, mockSortedKeys } from '../test/mockData';

export default {
  title: 'Components/PathwayVisualisation/AccessibleTable',
  component: AccessibleTable,
} as ComponentMeta<typeof AccessibleTable>;

const Template: ComponentStory<typeof AccessibleTable> = (args) => <AccessibleTable { ...args } />;

export const Default = Template.bind({});
Default.args = {
  data: mockPatientData,
  sortedKeys: mockSortedKeys,
};
