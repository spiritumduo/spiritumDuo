import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './MdtManagement.stories';

const { Default } = composeStories(stories);

test('the date selector should show when clicking input element', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  click(screen.getByRole('tab', { name: /create mdt/i }));

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
  click(screen.getByRole('tab', { name: /create mdt/i }));

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
  click(screen.getByRole('tab', { name: /create mdt/i }));

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
    expect(screen.getByText(/3000-01-01t00:00:00/i));
    expect(screen.getByText(/test location/i));
  });
});

// update mdt

test('the date selector should show when clicking input element', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  click(screen.getByRole('tab', { name: /update mdt/i }));
  await waitFor(() => expect(screen.getByLabelText(/select mdt/i)));
  await click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
});

test('selecting a date should autofill fields', async () => {
  render(<Default />);

  const { click } = userEvent.setup();
  click(screen.getByRole('tab', { name: /update mdt/i }));

  await waitFor(() => expect(screen.getByLabelText(/select mdt/i)));
  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(async () => expect(screen.getByText('15')));
  await click(screen.getByText('15'));

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/update date of mdt/i) as HTMLInputElement).value).toMatch('01/01/2022');
    expect((screen.getByLabelText(/creator/i) as HTMLInputElement).value).toMatch(/test user/i);
  });
});

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click, type } = userEvent.setup();
  click(screen.getByRole('tab', { name: /update mdt/i }));

  await waitFor(() => expect(screen.getByLabelText(/select mdt/i)));

  await click(screen.getByLabelText(/select mdt/i));
  await waitFor(async () => expect(screen.getByText('15')));
  await click(screen.getByText('15'));

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/update date of mdt/i) as HTMLInputElement).value).toMatch('01/01/2022');
    expect((screen.getByLabelText(/creator/i) as HTMLInputElement).value).toMatch(/test user/i);
  });

  await type(screen.getByLabelText(/location/i), 'new test location');
  await click(screen.getByRole('button', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
    expect(screen.getByText(/test pathway/i));
    expect(screen.getByText(/3000-01-01t00:00:00/i));
    expect(screen.getByText(/test location/i));
  });
});
