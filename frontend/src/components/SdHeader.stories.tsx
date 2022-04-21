/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PathwayOption from 'types/PathwayOption';
import { MemoryRouter } from 'react-router-dom';
import SdHeader from './SdHeader';

export default {
  title: 'components/SdHeader',
  component: SdHeader,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof SdHeader>;

const Template: ComponentStory<typeof SdHeader> = (args) => <SdHeader { ...args } />;

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
Standard.args = {
  pathwayOptions: pathways,
  currentPathwayId: pathways[0].id,
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
    console.log(e); // is there some kind of storybook method to make this appear in actions?
  },
  user: {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    defaultPathwayId: 1,
    department: 'Test department',
    roles: [{ id: 1, name: 'test' }],
    token: 'token',
  },
};

export const Admin = Template.bind({});
Admin.args = {
  pathwayOptions: pathways,
  currentPathwayId: pathways[0].id,
  pathwayOnItemSelect: (name) => console.log(name),
  searchOnSubmit: (e) => {
    e.preventDefault();
  },
  user: {
    id: 1,
    firstName: 'Eileen',
    lastName: 'Streiter',
    defaultPathwayId: 1,
    department: 'Test department',
    roles: [{ id: 1, name: 'test' }],
    token: 'token',
  },
};
