/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentMeta, ComponentStory, Story } from '@storybook/react';

import { mockPatientData } from './test/mockData';
import PathwayVisualisation, { PathwayVisualisationProps } from './PathwayVisualisation';

// Storybook default export
export default {
  title: 'Components/PathwayVisualisation',
  component: PathwayVisualisation,
} as ComponentMeta<typeof PathwayVisualisation>;

const Template: ComponentStory<typeof PathwayVisualisation> = (args) => (
  <PathwayVisualisation { ...args } />
);

export const Default = Template.bind({});
Default.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  width: 900,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const Medium = Template.bind({});
Medium.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  width: 600,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const Small = Template.bind({});
Small.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  width: 320,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const WithNationalNumber = Template.bind({});
WithNationalNumber.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  showNationalNumber: true,
  width: 900,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const MediumWithNationalNumber = Template.bind({});
MediumWithNationalNumber.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  showNationalNumber: true,
  width: 600,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};

export const SmallWithNationalNumber = Template.bind({});
SmallWithNationalNumber.args = {
  data: mockPatientData,
  maxDays: 70,
  showName: true,
  showNationalNumber: true,
  width: 300,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
};
