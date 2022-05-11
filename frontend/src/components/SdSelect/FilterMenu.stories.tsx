/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Dropdown } from 'react-bootstrap';

import FilterMenu, { FilterMenuProps } from './FilterMenu';
import CheckboxOption from './CheckboxOption';

export default {
  title: 'components/FilterMenu',
  component: FilterMenu,
} as Meta<FilterMenuProps>;

export const Default: Story<FilterMenuProps> = () => (
  <FilterMenu>
    <Dropdown.Item>Item 1</Dropdown.Item>
    <Dropdown.Item>Item 2</Dropdown.Item>
    <Dropdown.Item>Item 3</Dropdown.Item>
    <>Thing</> <br />
    Other Thing <br />
    Some warrr
    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
    <CheckboxOption label="Checkbox Item" />
  </FilterMenu>
);
