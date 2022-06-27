import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './UpdateMdtTab.stories';

const { Default, MdtAlreadyExists } = composeStories(stories);

test('form inputs should be filled automatically', async () => {
  render(<Default />);

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toMatch('01/01/2022');
  });
});

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click, type } = userEvent.setup();

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toMatch('01/01/2022');
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

test('error state handled properly', async () => {
  render(<MdtAlreadyExists />);

  const { click, type } = userEvent.setup();

  await waitFor(() => {
    expect((screen.getByLabelText(/location/i) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toMatch('01/01/2022');
  });

  await type(screen.getByLabelText(/location/i), 'new test location');
  await click(screen.getByRole('button', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByText(/an mdt on that date already exists/i));
  });
});
