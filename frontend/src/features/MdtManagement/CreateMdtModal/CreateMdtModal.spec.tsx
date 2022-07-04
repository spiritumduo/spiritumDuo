import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './CreateMdtModal.stories';

const { Default, MdtAlreadyExists } = composeStories(stories);

test('the date selector should show when clicking input element', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/date of mdt/i),
  );
  await click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
  await click(screen.getByText(/23/));
});

test('not selecting date or inputting location should show errors', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  expect(screen.getByLabelText(/date of mdt/i));
  expect(screen.getByLabelText(/location/i));

  await click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => {
    expect(screen.getByText(/a date is required/i));
    expect(screen.getByText(/a location is required/i));
  });
});

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click, type } = userEvent.setup();
  expect(
    screen.getByLabelText(/date of mdt/i),
  );
  await click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
  await click(screen.getByText(/23/));
  await type(screen.getByLabelText(/location/i), 'test location');
  await click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
    expect(screen.getByText(/test pathway/i));
    expect(screen.getByText(new Date('01/01/3000').toLocaleDateString()));
    expect(screen.getByText(/test location/i));
  });
});

test('adding an mdt on an existing date should show an error', async () => {
  render(<MdtAlreadyExists />);

  const { click, type } = userEvent.setup();
  expect(
    screen.getByLabelText(/date of mdt/i),
  );
  await click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
  await click(screen.getByText(/23/));
  await type(screen.getByLabelText(/location/i), 'test location');
  await click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => {
    expect(screen.getByText(/an mdt on that date already exists/i));
  });
});
