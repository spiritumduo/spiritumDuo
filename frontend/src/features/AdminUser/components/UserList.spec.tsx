/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './UserList.stories';

const { Default } = composeStories(stories);

describe('When the page loads', () => {
  let mockCallback: jest.Mock<void, [React.MouseEvent<HTMLButtonElement & HTMLTableRowElement>]>;
  beforeEach(async () => {
    mockCallback = jest.fn();
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default userOnClick={ mockCallback } />
      </MockSdApolloProvider>,
    );
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
  });

  it('Should display users', () => {
    // 3 users in mock + header
    expect(screen.getAllByRole('row').length).toBe(4);
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
