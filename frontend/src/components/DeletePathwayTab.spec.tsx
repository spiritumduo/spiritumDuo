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

  it('Should display pathway permission checkboxes', async () => {
    await waitFor(() => {
      expect(
        screen.getByLabelText('TEST_PERMISSION_ONE (ref_TEST_PERMISSION_ONE)'),
      );
      expect(
        screen.getByLabelText('TEST_PERMISSION_TWO (ref_TEST_PERMISSION_TWO)'),
      );
    });
  });
});

test('Pathway dropdown fills inputs with existing data', async () => {
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
    expect(screen.getByLabelText('TEST_PERMISSION_ONE (ref_TEST_PERMISSION_ONE)')).toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO (ref_TEST_PERMISSION_TWO)')).not.toBeChecked();
  });
});

test('Pathway dropdown clears inputs when set to default value', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  const select = screen.getByLabelText('Select existing pathway');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'pathway one' }));
    expect(screen.getByLabelText('TEST_PERMISSION_ONE (ref_TEST_PERMISSION_ONE)')).not.toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO (ref_TEST_PERMISSION_TWO)')).not.toBeChecked();
  });

  userEvent.selectOptions(select, ['1']);

  await waitFor(() => {
    expect(screen.getByLabelText('TEST_PERMISSION_ONE (ref_TEST_PERMISSION_ONE)')).toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO (ref_TEST_PERMISSION_TWO)')).not.toBeChecked();
  });

  userEvent.selectOptions(select, ['-1']);

  await waitFor(() => {
    expect(screen.getByLabelText('TEST_PERMISSION_ONE (ref_TEST_PERMISSION_ONE)')).not.toBeChecked();
    expect(screen.getByLabelText('TEST_PERMISSION_TWO (ref_TEST_PERMISSION_TWO)')).not.toBeChecked();
  });
});

// DEFAULT
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
