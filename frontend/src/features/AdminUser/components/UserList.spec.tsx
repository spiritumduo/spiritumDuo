/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { render, screen, waitFor, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './UserList.stories';

const { Default } = composeStories(stories);

async function renderDefault() {
  jest.useFakeTimers();
  const mockCallback = jest.fn();
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default userOnClick={ mockCallback } />
    </MockSdApolloProvider>,
  );
  expect(screen.queryByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(1000);
    jest.setSystemTime(Date.now() + 10000);
  });

  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
  jest.useRealTimers();
  return mockCallback;
}

describe('When the page loads', () => {
  it('Should display users', async () => {
    await renderDefault();

    // 3 users in mock + header
    await waitFor(() => expect(screen.getAllByRole('row').length).toBe(4));
  });

  it('Should fire the callback when a user name is clicked', async () => {
    const mockCallback = await renderDefault();

    const { click } = userEvent.setup();
    const buttons = screen.getAllByRole('link', { name: /john\s+doe/i });
    await waitFor(() => buttons.forEach(async (b) => click(b)));
    // The row callback will fire here too, so it's double
    await waitFor(() => expect(mockCallback).toBeCalledTimes(6));
  });

  it('Should fire the callback when a user row is clicked', async () => {
    const mockCallback = await renderDefault();

    const { click } = userEvent.setup();
    const rows = screen.getAllByRole('row', { name: /john\s+doe/i });
    await waitFor(() => rows.forEach(async (b) => click(b)));
    // The row callback will fire here too, so it's double
    await waitFor(() => expect(mockCallback).toBeCalledTimes(3));
  });
});
