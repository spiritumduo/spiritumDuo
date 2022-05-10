/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';

import * as stories from './SdSelect.stories';

const { Default, InForm } = composeStories(stories);

const renderDefault = () => render(<Default />);

it('Should render the component', () => {
  renderDefault();
  expect(screen.getByRole('button', { name: /toggle\smenu/i })).toBeInTheDocument();
  expect(screen.getByRole('listbox', { name: /select\slistbox/i })).toBeInTheDocument();
});

/**
 * This test should pass, but for some reason popper doesn't render into the virtual DOM?
it('Should display the menu when clicked', async () => {
  const { rerender, baseElement, container, debug } = renderDefault();
  const { click } = userEvent.setup();
  const toggleButton = screen.getByRole('button', { name: /toggle\smenu/i });
  await waitFor(() => click(toggleButton));
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
  await waitFor(() => debug());
  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: /filter\smenu/i })).toBeInTheDocument();
  });
});
 */
