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

describe('When available roles are selected', () => {
  let availableRoleSelect: HTMLElement; 
  let selectedRoleSelect: HTMLElement;
  beforeEach( async () => {
    await renderDefault();
    availableRoleSelect = screen.getByRole('listbox', { name: /available\s+roles/i });
    selectedRoleSelect = screen.getByRole('listbox', { name: /selected\s+roles/i });
  });

  it('Selected roles should be empty to start with', () => {
    const selectedRoles = within(selectedRoleSelect).queryAllByRole('option');
    expect(selectedRoles.length).toBe(0);
  });

  it('Roles should move from available to selected', async () => {
    const { click, selectOptions } = userEvent.setup();
    await waitFor(async () => {
      const availableRoleOptions = within(availableRoleSelect).getAllByRole('option');
      await selectOptions(availableRoleSelect, [availableRoleOptions[0], availableRoleOptions[1]]);
      await click(screen.getByRole('button', { name: /add\s+roles/i }));
    });
    const finalSelectedRoles = within(selectedRoleSelect).getAllByRole('option');
    expect(finalSelectedRoles.length).toBe(2);
  });

  it('Roles should move from selected to available', async () => {
    const { click, selectOptions } = userEvent.setup();
    await waitFor(async () => {
      const availableRoleOptions = within(availableRoleSelect).getAllByRole('option');
      await selectOptions(availableRoleSelect, availableRoleOptions);
      await click(screen.getByRole('button', { name: /add\s+roles/i }));
    });

    await waitFor(async () => {
      const selectedRoleOptions = within(selectedRoleSelect).getAllByRole('option');
      await selectOptions(selectedRoleSelect, selectedRoleOptions[1]);
      await click(screen.getByRole('button', { name: /remove\s+roles/i }));
    });
    const finalSelectedRoles = within(selectedRoleSelect).getAllByRole('option');
    expect(finalSelectedRoles.length).toBe(3);
  });
});
