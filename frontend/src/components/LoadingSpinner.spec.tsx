import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from './LoadingSpinner.stories';

const { Default } = composeStories(stories);

test('Should not display when loading prop is false', async () => {
  act(() => {
    render(<Default loading={ false } />);
  });
  expect(screen.queryByText(/Loading animation/i)).not.toBeInTheDocument();
});

test('Should display when loading prop is true', async () => {
  act(() => {
    render(<Default loading />);
  });
  expect(screen.getByText(/Loading animation/i)).toBeInTheDocument();
});

test('Should display when loading prop is true then when loading false disappear after 500ms', async () => {
  jest.useFakeTimers(); // allows us to manipulate setInterval/setTimeout, etc
  jest.spyOn(global, 'setTimeout');

  await act(async () => {
    const { rerender } = render(<Default loading />); // initial loading as true
    rerender(<Default loading={ false } />); // rerender does not replace comp, lets us update props
  });
  await waitFor(() => expect(screen.getByText(/Loading animation/i)).toBeInTheDocument()); // checks delay works

  await act(async () => {
    await jest.advanceTimersByTime(250); // wait 250ms to further check if delay works
  });
  await waitFor(() => expect(screen.getByText(/Loading animation/i)).toBeInTheDocument()); // check animation still on screen

  await act(async () => {
    await jest.advanceTimersByTime(250);
    // advance 250ms further (500ms, animation should not be present)
  });
  expect(screen.queryByText(/Loading animation/i)).not.toBeInTheDocument(); // check timer not displayed

  jest.useRealTimers(); // cleanup timer changes
});
