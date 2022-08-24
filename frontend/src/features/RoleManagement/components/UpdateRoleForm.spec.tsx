/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './UpdateRoleForm.stories';

const { Default, ConflictError } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(() => {
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
  });

  it('Should display roles in the dropdown', async () => {
    const { click } = userEvent.setup();
    click(screen.getByRole('combobox', { name: /Select existing role/i }));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Role 1' }));
    });
  });
});

test('Role dropdown fills inputs with existing data', async () => {
  const { click, selectOptions } = userEvent.setup();
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByRole('combobox', { name: /Select existing role/i });
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  selectOptions(select, ['1']);

  click(screen.getByText('Select...'));
  await waitFor(() => {
    expect(screen.getByText('TEST_PERMISSION_ONE'));
  });
});

test('Role dropdown clears inputs when set to default value', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByRole('combobox', { name: /Select existing role/i });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  await waitFor(() => {
    userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
    userEvent.click(screen.getByText('TEST_PERMISSION_ONE'));
  });

  userEvent.selectOptions(select, ['-1']);

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Role name' }) as HTMLInputElement).value).toBe('');
    expect(screen.queryByText('TEST_PERMISSION_ONE')).not.toBeInTheDocument();
  });
});

test('Submitting should show modal confirmation', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );

  const select = screen.getByRole('combobox', { name: /Select existing role/i });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  await waitFor(() => {
    userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
    expect(screen.queryByText('TEST_PERMISSION_ONE')).not.toBeInTheDocument();
  });

  const submitButton = screen.getByRole('button', { name: 'Update role' });
  await waitFor(() => {
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText('name returned from server'));
    expect(screen.getByText('permission 1 from server'));
    expect(screen.getByText('permission 2 from server'));
  });
});

// ROLE ALREADY EXISTS
test('Submitting should display error', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <ConflictError />
    </MockSdApolloProvider>,
  );

  const select = screen.getByRole('combobox', { name: /Select existing role/i });

  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  await waitFor(() => {
    userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
    expect(screen.queryByText('TEST_PERMISSION_ONE')).not.toBeInTheDocument();
  });

  const submitButton = screen.getByRole('button', { name: 'Update role' });
  await waitFor(() => {
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText(/a role with this name already exists/i));
  });
});
