import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

// LOCAL IMPORTS
import * as stories from './MDT.stories';

const { Default } = composeStories(stories);

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

  it('Should show patient demographics and reason for mdt referral', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('First Last (1)')).toBeInTheDocument();
      expect(screen.getByText('fMRN0000001')).toBeInTheDocument();
      expect(screen.getByText('fNHS0000001')).toBeInTheDocument();
      expect(screen.getByText('1/1/2000')).toBeInTheDocument();
      expect(screen.getByText('reason goes here (1)')).toBeInTheDocument();
    });
  });
});
