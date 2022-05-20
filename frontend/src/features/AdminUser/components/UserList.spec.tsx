/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { render, screen, waitFor, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './UserList.stories';

const { Default } = composeStories(stories);

describe('When the page loads', () => {
  let mockCallback: jest.Mock<void, [string]>;
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    mockCallback = jest.fn();
    await act(async () => {
      render(
        <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
          <Default userOnClick={ mockCallback } />
        </MockSdApolloProvider>,
      );
      await waitFor(() => expect(screen.queryByText(/loading animation/i)).toBeInTheDocument());
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => expect(screen.queryByText(/loading animation/i)).not.toBeInTheDocument());
    jest.useRealTimers();
  });

  it('Should display users', async () => {
    // 3 users in mock + header
    await waitFor(() => expect(screen.getAllByRole('row').length).toBe(4));
  });

  it('Should fire the callback when a user name is clicked', async () => {
    const { click } = userEvent.setup();
    const buttons = screen.getAllByRole('link', { name: /john\s+doe/i });
    await waitFor(() => buttons.forEach(async (b) => click(b)));
    // The row callback will fire here too, so it's double
    await waitFor(() => expect(mockCallback).toBeCalledTimes(6));
  });

  it('Should fire the callback when a user row is clicked', async () => {
    const { click } = userEvent.setup();
    const rows = screen.getAllByRole('row', { name: /john\s+doe/i });
    await waitFor(() => rows.forEach(async (b) => click(b)));
    // The row callback will fire here too, so it's double
    await waitFor(() => expect(mockCallback).toBeCalledTimes(3));
  });
});
