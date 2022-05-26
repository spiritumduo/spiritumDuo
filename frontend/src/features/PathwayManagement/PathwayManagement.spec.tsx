/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

// LOCAL IMPORTS
import * as stories from './PathwayManagement.stories';

const { Default } = composeStories(stories);

describe('When the page loads', () => {
  it('Should display the loading spinner and then display the tabs', async () => {
    jest.useFakeTimers();
    render(
      <Default />,
    );
    await act(async () => {
      expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();
    });

    await act(async () => {
      jest.setSystemTime(Date.now() + 10000);
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Create pathway/i } )).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Update pathway/i } )).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Delete pathway/i } )).toBeInTheDocument();
  });
});
