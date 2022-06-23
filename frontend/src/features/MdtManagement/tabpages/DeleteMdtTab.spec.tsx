import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DeleteMdtTab.stories';

const { Default, MdtAlreadyExists } = composeStories(stories);

test('the date selector should show when clicking input element', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/select mdt/i),
  );
  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
});

test('selecting a date should autofill fields', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/select mdt/i),
  );
  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(async () => expect(screen.getByText('15')));
  await click(screen.getByText('15'));

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/creator/i) as HTMLInputElement).value).toMatch(/test user/i);
  });
});

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/select mdt/i),
  );
  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(async () => expect(screen.getByText('15')));
  await click(screen.getByText('15'));

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/creator/i) as HTMLInputElement).value).toMatch(/test user/i);
  });

  await click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});

test('deleting an mdt with a relation should show an error', async () => {
  render(<MdtAlreadyExists />);

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/select mdt/i),
  );
  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(async () => expect(screen.getByText('15')));
  await click(screen.getByText('15'));

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/creator/i) as HTMLInputElement).value).toMatch(/test user/i);
  });

  await click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByText(/you cannot delete an mdt with a relation/i));
  });
});
