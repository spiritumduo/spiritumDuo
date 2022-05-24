/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import * as stories from './AdminUserUpdate.stories';

const { Default, Loading, Error } = composeStories(stories);

// DEFAULT TESTS
const renderDefault = async () => {
  render(
    <NewMockSdApolloProvider mocks={ Default.parameters?.apolloMocks }>
      <Default />
    </NewMockSdApolloProvider>,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
};

test('Confirmation should display on successful submit', async () => {
  await renderDefault();
  const { type, click } = userEvent.setup();
  await waitFor(async () => {
    type(screen.getByRole('textbox', { name: /first\s+name/i }), 'New First name');
    type(screen.getByRole('textbox', { name: /last\s+name/i }), 'New Last name');
    type(screen.getByRole('textbox', { name: /email/i }), 'New-Email@email');
    type(screen.getByRole('textbox', { name: /department/i }), 'NewDepartment');
    type(screen.getByLabelText(/password/i), 'NewPassword');
  });
  await waitFor(async () => {
    await click(screen.getByRole('button', { name: /update\s+user/i }));
  });
  await waitFor(() => expect(screen.getByText(/user\s+updated/i)).toBeInTheDocument());
});

// LOADING
const renderLoading = () => render(
  <NewMockSdApolloProvider mocks={ Default.parameters?.apolloMocks }>
    <Loading />
  </NewMockSdApolloProvider>,
);

test('Submitting should disable form input', async () => {
  renderLoading();
  const { click, type } = userEvent.setup();
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const createUserBtn = screen.getByRole('button', { name: /create\s+user/i });
  await waitFor(async () => {
    type(screen.getByRole('textbox', { name: /first\s+name/i }), 'New First name');
    type(screen.getByRole('textbox', { name: /last\s+name/i }), 'New Last name');
    type(screen.getByRole('textbox', { name: /email/i }), 'New-Email@email');
    type(screen.getByRole('textbox', { name: /department/i }), 'NewDepartment');
    type(screen.getByLabelText(/password/i), 'NewPassword');

    await click(createUserBtn);
  });
  expect(passwordInput).toBeDisabled();
  expect(createUserBtn).toBeDisabled();
});

// ERROR STATUS CODE
const renderError = () => render(
  <NewMockSdApolloProvider mocks={ Error.parameters?.apolloMocks }>
    <Error />
  </NewMockSdApolloProvider>,
);

test('Error should display to user', async () => {
  renderError();
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));
  const { type } = userEvent.setup();
  // const createUserBtn = screen.getByRole('button', { name: /create\s+user/i });
  await waitFor(() => {
    type(screen.getByLabelText(/username/i), 'Username');
    type(screen.getByLabelText(/password/i), 'Password');
    type(screen.getByLabelText(/email/i), 'Email@email');
    type(screen.getByLabelText(/first name/i), 'First name');
    type(screen.getByLabelText(/last name/i), 'Last name');
    type(screen.getByLabelText(/department/i), 'Department');
  });
  await waitFor(() => expect(screen.getByRole('button', { name: /Update user/i })));
  const updateBtn = screen.getByRole('button', { name: /Update user/i });
  await updateBtn.click();
  await waitFor(() => expect(screen.getByText(/Error: /i)).toBeInTheDocument());
});
