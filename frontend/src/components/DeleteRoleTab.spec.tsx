/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './DeleteRoleTab.stories';

const { Default, Error } = composeStories(stories);

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
    expect(screen.getByLabelText('TEST_PERMISSION_ONE')).not.toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO')).not.toBeChecked();
  });

  userEvent.selectOptions(select, ['1']);

  await waitFor(() => {
    expect(screen.getByLabelText('TEST_PERMISSION_ONE')).toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO')).not.toBeChecked();
  });

  userEvent.selectOptions(select, ['-1']);

  await waitFor(() => {
    expect(screen.getByLabelText('TEST_PERMISSION_ONE')).not.toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO')).not.toBeChecked();
  });
});

// DEFAULT
test('Modal displays message role deleted', async () => {
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

  const submitButton = screen.getByRole('button', { name: 'Delete role' });
  await waitFor(() => {
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText('Role deleted'));
  });
});

// ROLE ALREADY EXISTS
test('Error should display if not successful', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Error />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing role');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'Role 1' }));
  });
  userEvent.selectOptions(select, ['1']);

  const submitButton = screen.getByRole('button', { name: 'Delete role' });
  userEvent.click(submitButton);

  await waitFor(() => {
    expect((screen.getByRole('alert') as HTMLElement).innerHTML).toMatch('error message from server (HTTP409 Conflict)');
  });
});
