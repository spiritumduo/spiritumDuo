/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './UpdatePathwayTab.stories';

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

test('Role dropdown fills inputs with existing data', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing pathway');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
  });
  userEvent.selectOptions(select, ['1']);
  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Pathway name' }) as HTMLInputElement).value).toMatch(/pathway one/i);
    expect(screen.getByLabelText('Test milestone type 1 (ref test milestone type 1)')).toBeChecked();
    expect(screen.getByLabelText('Test milestone type 2 (ref test milestone type 2)')).not.toBeChecked();
  });
});

test('Role dropdown clears inputs when set to default value', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing pathway');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
  });
  userEvent.selectOptions(select, ['1']);

  userEvent.type(screen.getByRole('textbox', { name: 'Pathway name' }), 'Test data go brrr');
  userEvent.click(screen.getByLabelText('Test milestone type 1 (ref test milestone type 1)'));
  userEvent.click(screen.getByLabelText('Test milestone type 2 (ref test milestone type 2)'));

  userEvent.selectOptions(select, ['-1']);

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: 'Pathway name' }) as HTMLInputElement).value).toBe('');
    expect(screen.getByLabelText('Test milestone type 1 (ref test milestone type 1)')).not.toBeChecked();
    expect(screen.getByLabelText('Test milestone type 2 (ref test milestone type 2)')).not.toBeChecked();
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
    expect(screen.getByText('Test milestone type 1'));
    expect(screen.getByText('Test milestone type 2'));
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
