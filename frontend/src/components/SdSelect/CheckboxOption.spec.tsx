/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';

import * as stories from './CheckboxOption.stories';

const { Default } = composeStories(stories);

const renderDefault = () => render(<Default />);
const labelText = /checkbox\s+input/i;

it('Should display the component', () => {
  renderDefault();
  expect(screen.getByRole('checkbox', { name: labelText })).toBeInTheDocument();
});
