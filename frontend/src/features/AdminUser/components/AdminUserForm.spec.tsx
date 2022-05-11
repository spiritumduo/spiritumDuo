/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import * as stories from '../AdminUserCreate.stories';

const { Default } = composeStories(stories);

const renderDefault = async () => {
  render(
    <NewMockSdApolloProvider mocks={ Default.parameters?.apolloMocks }>
      <Default />
    </NewMockSdApolloProvider>,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
};

test('Administration page should display correctly', async () => {
  await renderDefault();
  expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create user/i })).toBeInTheDocument();
});

test('Create user should require username and password', async () => {
  await renderDefault();
  await waitFor(async () => userEvent.click(screen.getByRole('button', { name: /create\s+user/i })));
  expect(screen.getByText(/Username is a required field/i)).toBeInTheDocument();
  expect(screen.getByText(/Password is a required field/i)).toBeInTheDocument();
});

test('Selected roles should be empty to start with', async () => {
  await renderDefault();
  const selectedRoles = await within(
    screen.getByRole('listbox', { name: /roles/i }),
  ).queryAllByText(/role/i);
  expect(selectedRoles.length).toBe(0);
});

/**
 * Figure out how to make popper appear in test dom to make this work
test('Roles should appear in dropdown', async () => {
  await renderDefault();
  const { click } = userEvent.setup();
  const toggleButton = screen.getByRole('button', { name: /toggle\smenu/i });
  await waitFor(() => click(toggleButton));
  expect(screen.getByRole('textbox', { name: /filter\s+menu/i })).toBeInTheDocument();
});
 */
