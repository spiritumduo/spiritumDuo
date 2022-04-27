/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './RoleManagementTabs.stories';

const { Default, RoleExistsError } = composeStories(stories);

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
        screen.getByLabelText('Test permission 1'),
      );
      expect(
        screen.getByLabelText('Test permission 2'),
      );
      expect(
        screen.getByLabelText('Test permission 3'),
      );
      expect(
        screen.getByLabelText('Test permission 4'),
      );
    });
  });
});

// DEFAULT
test('Submitting should disable form input', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const roleNameTxt = screen.getByLabelText(/Role name/);
  const submitButton = screen.getByRole('button', { name: 'Create role' });
  await waitFor(() => {
    userEvent.type(roleNameTxt, 'Test role name');
    userEvent.click(submitButton);
    expect(roleNameTxt).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
  await waitFor(() => {
    expect(screen.getByText('name returned from server'));
    expect(screen.getByText('permission 1 from server'));
    expect(screen.getByText('permission 2 from server'));
  });
});

// ROLE ALREADY EXISTS
test('Submitting should disable form input', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <RoleExistsError />
    </MockSdApolloProvider>,
  );
  const roleNameTxt = screen.getByLabelText(/Role name/);
  const submitButton = screen.getByRole('button', { name: 'Create role' });
  await waitFor(() => {
    userEvent.type(roleNameTxt, 'Test role name');
    userEvent.click(submitButton);
    expect(roleNameTxt).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
  await waitFor(() => {
    expect(screen.getByText('Error: a role with this name already exists'));
  });
});
