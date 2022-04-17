/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Administration.stories';

const { Default, Loading, Error, UsernameAlreadyExists } = composeStories(stories);

// DEFAULT TESTS
const renderDefault = () => render(<Default />);

test('Administration page should display correctly', () => {
  renderDefault();
  expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Create user/i })).toBeInTheDocument();
});

test('Administration should require username and password', async () => {
  renderDefault();
  await waitFor(async () => userEvent.click(screen.getByRole('button', { name: 'Create user' })));
  expect(screen.getByText(/Username is a required field/i)).toBeInTheDocument();
  expect(screen.getByText(/Password is a required field/i)).toBeInTheDocument();
});

test('Administration should display modal on submit', async () => {
  renderDefault();
  await waitFor(() => {
    userEvent.type(screen.getByLabelText(/username/i), 'Username');
    userEvent.type(screen.getByLabelText(/password/i), 'Password');
    userEvent.type(screen.getByLabelText(/first name/i), 'First name');
    userEvent.type(screen.getByLabelText(/last name/i), 'Last name');
    userEvent.type(screen.getByLabelText(/department/i), 'Department');
  });
  await waitFor(() => userEvent.click(screen.getByRole('button', { name: /create user/i })));
  expect(screen.getByText(/user created/i)).toBeInTheDocument();
});

// LOADING
test('Submitting should disable form input', async () => {
  render(<Loading />);
  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const createUserBtn = screen.getByRole('button', { name: 'Create user' });
  await waitFor(() => {
    userEvent.type(screen.getByLabelText(/username/i), 'Username');
    userEvent.type(screen.getByLabelText(/password/i), 'Password');
    userEvent.type(screen.getByLabelText(/first name/i), 'First name');
    userEvent.type(screen.getByLabelText(/last name/i), 'Last name');
    userEvent.type(screen.getByLabelText(/department/i), 'Department');

    userEvent.click(createUserBtn);
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(createUserBtn).toBeDisabled();
  });
});

// ERROR STATUS CODE
test('Error should display to user', async () => {
  render(<Error />);
  const createUserBtn = screen.getByRole('button', { name: 'Create user' });
  await waitFor(() => {
    userEvent.type(screen.getByLabelText(/username/i), 'Username');
    userEvent.type(screen.getByLabelText(/password/i), 'Password');
    userEvent.type(screen.getByLabelText(/first name/i), 'First name');
    userEvent.type(screen.getByLabelText(/last name/i), 'Last name');
    userEvent.type(screen.getByLabelText(/department/i), 'Department');
  });
  await waitFor(() => userEvent.click(createUserBtn));
  expect(screen.getByText(/Error: /i)).toBeInTheDocument();
});

// USERNAME ALREADY EXISTS
test('Invalid administration should display to user', async () => {
  render(<UsernameAlreadyExists />);
  const createUserBtn = screen.getByRole('button', { name: 'Create user' });
  await waitFor(() => {
    userEvent.type(screen.getByLabelText(/username/i), 'Username');
    userEvent.type(screen.getByLabelText(/password/i), 'Password');
    userEvent.type(screen.getByLabelText(/first name/i), 'First name');
    userEvent.type(screen.getByLabelText(/last name/i), 'Last name');
    userEvent.type(screen.getByLabelText(/department/i), 'Department');
  });
  await waitFor(() => userEvent.click(createUserBtn));
  expect(screen.getByText(/an account with this username already exists/i)).toBeInTheDocument();
});
