/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';

import * as stories from './FilterMenu.stories';

const { Default } = composeStories(stories);

it('Should render the menu', () => {
  render(<Default />);
  expect(screen.getByRole('textbox', { name: /filter\smenu/i })).toBeInTheDocument();
});

it('Should filter the menu', async () => {
  render(<Default />);
  const { type } = userEvent.setup();
  const filterMenu = screen.getByRole('textbox', { name: /filter\smenu/i });
  await waitFor(() => type(filterMenu, 'Item'));
  const buttons = screen.getAllByRole('button', { name: /item/i });
  expect(buttons.length).toBe(3);
});
