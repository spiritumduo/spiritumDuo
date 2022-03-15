import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { MockedProvider } from '@apollo/client/testing';
import * as stories from './PreviousDecisionPoints.stories';

const { Default } = composeStories(stories);

const renderDefault = () => render(
  <MockedProvider mocks={ Default.parameters?.apolloClient.mocks }>
    <Default />
  </MockedProvider>,
);

it('Should display loading while waiting for data', () => {
  renderDefault();
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('Should display the page with previous decision points', async () => {
  renderDefault();
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
