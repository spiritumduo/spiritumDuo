import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

// LOCAL IMPORTS
import * as stories from './MDT.stories';

const { Default } = composeStories(stories);

async function renderDefault() {
  jest.useFakeTimers();
  render(
    <Default />,
  );
  expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
}

describe('When the page loads', () => {
  it('Should display the loading spinner and then disappear', async () => {
    jest.useFakeTimers();
    render(
      <Default />,
    );
    expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

    await act(async () => {
      jest.setSystemTime(Date.now() + 10000);
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
  });
});

test('it should display the first breadcrumb', async () => {
  await renderDefault();

  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /mdt list/i }),
    ).toBeInTheDocument();
  });
});

test('when an MDT is selected it should display the first and second breadcrumb', async () => {
  await renderDefault();

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /mdt list/i }),
    ).toBeInTheDocument();
  });

  click(screen.getByRole('link', { name: new Date('2025-01-02').toLocaleDateString() }));

  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /patient list/i }),
    ).toBeInTheDocument();
  });
});

test('when an MDT is selected, clicking the first breadcrumb will return the user to the MDT list', async () => {
  await renderDefault();

  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /mdt list/i }),
    ).toBeInTheDocument();
  });

  click(screen.getByRole('link', { name: new Date('2025-01-02').toLocaleDateString() }));

  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: /patient list/i }),
    ).toBeInTheDocument();
  });

  click(screen.getByRole('link', { name: /mdt list/i }));

  await waitFor(() => {
    expect(
      screen.queryByRole('link', { name: /patient list/i }),
    ).not.toBeInTheDocument();
  });
});
