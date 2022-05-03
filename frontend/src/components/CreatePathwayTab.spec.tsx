/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './CreatePathwayTab.stories';

const { Default, PathwayExistsError } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(() => {
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
  });

  it('Should display milestone type checkboxes', async () => {
    await waitFor(() => {
      expect(
        screen.getByLabelText('Test milestone type 1 (ref test milestone type 1)'),
      );
      expect(
        screen.getByLabelText('Test milestone type 2 (ref test milestone type 2)'),
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
  const pathwayNameTxt = screen.getByLabelText(/Pathway name/);
  const submitButton = screen.getByRole('button', { name: 'Create pathway' });
  await waitFor(() => {
    userEvent.type(pathwayNameTxt, 'Test pathway name');
    userEvent.click(submitButton);
    expect(pathwayNameTxt).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});

test('Submitting should show modal confirmation', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const pathwayNameTxt = screen.getByLabelText(/Pathway name/);
  const submitButton = screen.getByRole('button', { name: 'Create pathway' });
  await waitFor(() => {
    userEvent.type(pathwayNameTxt, 'Test pathway name');
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText('test pathway'));
    expect(screen.getByText('test milestone one'));
    expect(screen.getByText('test milestone two'));
  });
});

// ROLE ALREADY EXISTS
test('Submitting should display error', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <PathwayExistsError />
    </MockSdApolloProvider>,
  );
  const pathwayNameTxt = screen.getByLabelText(/Pathway name/);
  const submitButton = screen.getByRole('button', { name: 'Create pathway' });
  userEvent.type(pathwayNameTxt, 'Test pathway name');
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/name already exists/i));
  });
});
