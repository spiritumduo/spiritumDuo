import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './PatientOnMdtManagement.stories';

const { Default, ErrorStates } = composeStories(stories);

// UPDATE - NORMAL
test('on load it autofills information', async () => {
  render(<Default />);

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i }));
  });

  click(screen.getByRole('tab', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i })).toHaveAttribute('aria-selected', 'true');
  });

  await waitFor(() => {
    expect((screen.getByLabelText(/reason added to mdt/i) as HTMLInputElement).value).toMatch(/test reason/i);
    expect((screen.getByText(/test patient, fMRN: 123456L, fNHS: 123-456-78L/i))).toBeInTheDocument();
  });
});

test('valid input displays success', async () => {
  render(<Default />);

  const { click, keyboard } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i }));
  });

  click(screen.getByRole('tab', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i })).toHaveAttribute('aria-selected', 'true');
  });

  click(screen.getByLabelText(/reason added to mdt/i));
  keyboard('test update data go brrt');

  click(screen.getByRole('button', { name: /update patient/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});

// DELETE - NORMAL
test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete/i }));
  });

  click(screen.getByRole('tab', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete/i })).toHaveAttribute('aria-selected', 'true');
  });

  await click(screen.getByRole('button', { name: /remove patient/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});

// UPDATE - ERROR STATES
test('valid input displays success', async () => {
  render(<ErrorStates />);

  const { click, keyboard } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i }));
  });

  click(screen.getByRole('tab', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update/i })).toHaveAttribute('aria-selected', 'true');
  });

  click(screen.getByLabelText(/reason added to mdt/i));
  keyboard('test update data go brrt');

  click(screen.getByRole('button', { name: /update patient/i }));

  await waitFor(() => {
    expect(screen.getByText(/an error has occured/i)).toBeInTheDocument();
  });
});

// DELETE - ERROR STATE
test('valid inputs should show success page', async () => {
  render(<ErrorStates />);

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete/i }));
  });

  click(screen.getByRole('tab', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete/i })).toHaveAttribute('aria-selected', 'true');
  });

  await click(screen.getByRole('button', { name: /remove patient/i }));

  await waitFor(() => {
    expect(screen.getByText(/an error has occured/i));
  });
});
