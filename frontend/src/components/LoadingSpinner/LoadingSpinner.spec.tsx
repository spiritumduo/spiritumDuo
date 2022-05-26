import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from './LoadingSpinner.stories';

const { Default } = composeStories(stories);

test('Should not display when loading prop is false', async () => {
  act(() => {
    render(<Default loading={ false } />);
  });
  expect(screen.queryByText(/loading finished/i)).toBeInTheDocument();
});

test('Should display when loading prop is true', async () => {
  jest.useFakeTimers();
  act(() => {
    render(<Default loading />);
  });
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  act(() => {
    jest.setSystemTime(Date.now() + 10000);
  });
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  jest.useRealTimers();
});

test('Should display when loading prop is true then when loading false disappear after 500ms', async () => {
  jest.useFakeTimers(); // allows us to manipulate setInterval/setTimeout, etc

  let rerender: any;
  await act(async () => {
    const { rerender: _rerender } = render(<Default loading />); // initial loading as true
    rerender = _rerender;
  });
  expect(screen.getByText(/loading/i)).toBeInTheDocument(); // checks delay works

  rerender(<Default loading={ false } />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument(); // checks delay works

  jest.setSystemTime(Date.now() + 1000);

  await act(async () => {
    jest.advanceTimersByTime(500);
  });
  jest.useRealTimers();

  expect(screen.queryByText(/loading finished/i)).toBeInTheDocument(); // checks delay works
});
