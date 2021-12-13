/* eslint-disable comma-dangle */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Login.stories';

const { Default, Loading, Error, InvalidLogin } = composeStories(stories);

// DEFAULT TESTS
const renderDefault = () => render(<Default />);

test('Login page should display correctly', () => {
  renderDefault();
  expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('Login should require username and password', async () => {
  renderDefault();
  await waitFor(async () => userEvent.click(screen.getByRole('button', { name: 'Login' })));
  expect(screen.getByText(/username is a required field/i)).toBeInTheDocument();
  expect(screen.getByText(/password is a required field/i)).toBeInTheDocument();
});

test('Login should redirect to / on success', async () => {
  renderDefault();
  await waitFor(() => {
    userEvent.type(screen.getByRole('textbox', { name: /username/i }), 'Username');
    userEvent.type(screen.getByLabelText(/password/i), 'Password');
    userEvent.click(screen.getByRole('button', { name: /login/i }));
  });
  // We have a mock home page which is just this
  expect(screen.getByText(/Login success/i)).toBeInTheDocument();
});

// LOADING
test('Submitting should disable form input', async () => {
  render(<Loading />);
  const usernameInput = screen.getByRole('textbox', { name: 'Username' });
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: 'Login' });
  await waitFor(() => {
    userEvent.type(usernameInput, 'Username');
    userEvent.type(passwordInput, 'Password');
    userEvent.click(loginButton);
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(loginButton).toBeDisabled();
  });
});

// ERROR STATUS CODE
test('Error should display to user', async () => {
  render(<Error />);
  const usernameInput = screen.getByRole('textbox', { name: 'Username' });
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: 'Login' });
  await waitFor(() => {
    userEvent.type(usernameInput, 'Username');
    userEvent.type(passwordInput, 'Password');
    userEvent.click(loginButton);
  });
  expect(screen.getByText(/error:/i)).toBeInTheDocument();
});

// INCORRECT LOGIN
test('Invalid login should display to user', async () => {
  render(<InvalidLogin />);
  const usernameInput = screen.getByRole('textbox', { name: 'Username' });
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: 'Login' });
  await waitFor(() => {
    userEvent.type(usernameInput, 'Username');
    userEvent.type(passwordInput, 'Password');
    userEvent.click(loginButton);
  });
  expect(screen.getByText(/Incorrect username and\/or password/i)).toBeInTheDocument();
});
