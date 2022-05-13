/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './UpdateRoleTab.stories';

const { Default, ConflictError } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(() => {
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
  });

  it('Should display role permission checkboxes', async () => {
    await waitFor(() => {
      expect(
        screen.getByLabelText('TEST_PERMISSION_ONE'),
      );
      expect(
        screen.getByLabelText('TEST_PERMISSION_TWO'),
      );
    });
  });
});

test('Role dropdown fills inputs with existing data', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing role');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);
  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Role name' }) as HTMLInputElement).value).toMatch(/role 1/i);
    expect(screen.getByLabelText('TEST_PERMISSION_ONE')).toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO')).not.toBeChecked();
  });
});

test('Role dropdown clears inputs when set to default value', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing role');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_ONE'));
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_TWO'));

  userEvent.selectOptions(select, ['-1']);

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Role name' }) as HTMLInputElement).value).toBe('');
    expect(screen.getByLabelText('TEST_PERMISSION_ONE')).not.toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO')).not.toBeChecked();
  });
});

test('Submitting should show modal confirmation', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );

  const select = screen.getByLabelText('Select existing role');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_ONE'));
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_TWO'));

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

  const select = screen.getByLabelText('Select existing role');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  userEvent.type(screen.getByRole('textbox', { name: 'Role name' }), 'Test data go brrr');
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_ONE'));
  userEvent.click(screen.getByLabelText('TEST_PERMISSION_TWO'));

  const submitButton = screen.getByRole('button', { name: 'Update role' });
  await waitFor(() => {
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText(/a role with this name already exists/i));
  });
});
