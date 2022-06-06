/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './DeletePathwayTab.stories';

const { Default, PathwayHasConstraints } = composeStories(stories);

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
    expect(screen.getByText('TEST_MILESTONE_TYPE_ONE'));
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

  click(screen.getByText('Select...'));
  await waitFor(() => {
    expect(screen.getByText('TEST_MILESTONE_TYPE_ONE'));
  });
  selectOptions(select, ['-1']);

  await waitFor(() => {
    expect(screen.queryByText('TEST_MILESTONE_TYPE_ONE')).not.toBeInTheDocument();
    expect(screen.queryByText('TEST_MILESTONE_TYPE_TWO')).not.toBeInTheDocument();
  });
});

// // DEFAULT
test('Modal displays message pathway deleted', async () => {
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

  const submitButton = screen.getByRole('button', { name: 'Delete pathway' });
  await waitFor(() => {
    userEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(screen.getByText('Pathway deleted'));
  });
});

// ROLE ALREADY EXISTS
test('Error should display if not successful', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <PathwayHasConstraints />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing pathway');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
  });
  userEvent.selectOptions(select, ['1']);

  const submitButton = screen.getByRole('button', { name: 'Delete pathway' });
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/pathway has constraints/i)).toBeInTheDocument();
  });
});
