import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './MdtManagement.stories';

const { Default } = composeStories(stories);

// update mdt

test('details should be autofilled', async () => {
  render(<Default />);

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update mdt/i }));
  });

  click(screen.getByRole('tab', { name: /update mdt/i }));

  await waitFor(() => {
    expect(screen.getByText(/update mdt/i)).toHaveAttribute('aria-selected', 'true');
  });

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/Date/) as HTMLInputElement).value).toMatch('01/01/2022');
    expect(screen.getByText(/test dummy \(tdummy\)/i)).toBeInTheDocument();
  });
});

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click, type } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update mdt/i }));
  });

  click(screen.getByRole('tab', { name: /update mdt/i }));

  await waitFor(() => {
    expect(screen.getByText(/update mdt/i)).toHaveAttribute('aria-selected', 'true');
  });

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/Date/) as HTMLInputElement).value).toMatch('01/01/2022');
  });

  await type(screen.getByLabelText(/location/i), 'new test location');
  await click(screen.getByRole('button', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
    expect(screen.getByText(/test pathway/i));
    expect(screen.getByText(/1\/1\/3000/i));
    expect(screen.getByText(/test location/i));
  });
});

// delete mdt

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete mdt/i }));
  });

  click(screen.getByRole('tab', { name: /delete mdt/i }));

  await waitFor(() => {
    expect(screen.getByText(/delete mdt/i)).toHaveAttribute('aria-selected', 'true');
  });

  await click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});
