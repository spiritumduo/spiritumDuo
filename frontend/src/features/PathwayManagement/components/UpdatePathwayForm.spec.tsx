/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './UpdatePathwayForm.stories';

const { Default, PathwayExistsError } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(() => {
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
  });

  it('Should display pathways in the dropdown', async () => {
    const { click } = userEvent.setup();
    click(screen.getByRole('combobox', { name: /Select existing pathway/i }));
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'pathway one' }));
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
  const select = screen.getByRole('combobox', { name: /Select existing pathway/i });
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
  });
  selectOptions(select, ['1']);

  click(screen.getByText('Select...'));
  await waitFor(() => {
    expect(screen.getByText('Test clinicalRequest type 1'));
  });
});

test('Role dropdown clears inputs when set to default value', async () => {
  const { click, selectOptions } = userEvent.setup();
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByRole('combobox', { name: /Select existing pathway/i });
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
  });
  selectOptions(select, ['1']);

  userEvent.type(screen.getByRole('textbox', { name: 'Pathway name' }), 'Test data go brrr');

  click(screen.getByText('Select...'));
  await waitFor(() => {
    expect(screen.getByText('Test clinicalRequest type 1'));
  });
  selectOptions(select, ['-1']);

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Pathway name' }) as HTMLInputElement).value).toBe('');
    expect(screen.queryByText('Test clinicalRequest type 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test clinicalRequest type 2')).not.toBeInTheDocument();
  });
});

test('Submitting should disable form input', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const pathwayNameTxt = screen.getByLabelText(/Pathway name/);
  const submitButton = screen.getByRole('button', { name: 'Update pathway' });
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
  const submitButton = screen.getByRole('button', { name: 'Update pathway' });
  await waitFor(() => {
    userEvent.type(pathwayNameTxt, 'Test pathway name');
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText('pathway one edited'));
    expect(screen.getByText('Test clinicalRequest type 1'));
    expect(screen.getByText('Test clinicalRequest type 2'));
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
  const submitButton = screen.getByRole('button', { name: 'Update pathway' });
  userEvent.type(pathwayNameTxt, 'Test pathway name');
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/name already exists/i));
  });
});
