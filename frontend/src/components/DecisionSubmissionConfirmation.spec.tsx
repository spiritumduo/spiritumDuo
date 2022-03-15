/* eslint-disable comma-dangle */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DecisionSubmissionConfirmation.stories';

const { Default, WithMilestonesAndConfirmations } = composeStories(stories);

test('Should display when no milestones', () => {
  render(<Default />);
  expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument();
  expect(screen.queryByText(/requests sent/i)).toBeNull();
});

test('Should display provided milestones', () => {
  render(<WithMilestonesAndConfirmations />);
  expect(screen.getByText(/Requests:/i)).toBeInTheDocument();
  WithMilestonesAndConfirmations.args?.milestones?.forEach((m) => {
    expect(screen.getByText(m.name)).toBeInTheDocument();
  });
});

test('Should display provided resolutions', () => {
  render(<WithMilestonesAndConfirmations />);
  expect(screen.getByText(/These results will be acknowledged/i)).toBeInTheDocument();
  WithMilestonesAndConfirmations.args?.milestoneResolutions?.forEach((m) => {
    expect(screen.getByText(m)).toBeInTheDocument();
  });
});
