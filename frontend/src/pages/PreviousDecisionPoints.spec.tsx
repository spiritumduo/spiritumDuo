import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { MockedProvider } from '@apollo/client/testing';
import * as stories from './PreviousDecisionPoints.stories';

const { Default } = composeStories(stories);

const renderDefault = async () => {
  jest.useFakeTimers(); // allows us to manipulate setInterval/setTimeout, etc
  jest.spyOn(global, 'setTimeout');
  await act(async () => {
    render(
      <MockedProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockedProvider>,
    );
    await jest.advanceTimersByTime(1000);
  });
  await waitFor(() => expect(screen.queryByText(/loading animation/i)).not.toBeInTheDocument());
  jest.useRealTimers(); // cleanup timer changes
};

it('Should display loading while waiting for data', async () => {
  await act(async () => {
    render(
      <MockedProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockedProvider>,
    );
  });
  expect(screen.getByText(/loading animation/i)).toBeInTheDocument();
});

it('Should display the page with previous decision points', async () => {
  await renderDefault();
  await waitFor(() => {
    const decisionPoints = Default.parameters?.apolloClient.mocks[0]
      .result.data.getPatient.onPathways[0].decisionPoints;
    decisionPoints.forEach((dp: any) => {
      expect(screen.getByText(new RegExp(dp.clinicHistory))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(dp.comorbidities))).toBeInTheDocument();
      dp.milestones?.forEach((m) => {
        expect(
          screen.getAllByRole('row', { name: new RegExp(`${m.milestoneType.name}\\s${m.currentState}`, 'i') }).length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
