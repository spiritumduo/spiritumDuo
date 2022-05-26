import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './PreviousDecisionPoints.stories';

const { Default } = composeStories(stories);

async function renderDefault() {
  jest.useFakeTimers();
  await act(() => {
    render(<Default />);
  });
  act(() => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(500);
  });
  jest.useRealTimers();
}

it('Should display loading while waiting for data', async () => {
  await act(async () => {
    render(
      <Default />,
    );
  });
  expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();
});

it('Should display the page with previous decision points', async () => {
  await renderDefault();
  await waitFor(() => {
    const decisionPoints = Default.parameters?.decisionPoints;
    decisionPoints.forEach((dp: any) => {
      expect(screen.getByText(new RegExp(dp.clinicHistory))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(dp.comorbidities))).toBeInTheDocument();
      dp.milestones?.forEach((m: any) => {
        expect(
          screen.getAllByRole('row', { name: new RegExp(`${m.milestoneType.name}\\s${m.currentState}`, 'i') }).length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
