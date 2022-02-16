/* eslint-disable comma-dangle */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DecisionSubmissionSuccess.stories';

const { Default, WithMilestones } = composeStories(stories);

test('Should display success when no milestones', () => {
  render(<Default />);
  expect(screen.getByText(/Decision Submitted/i)).toBeInTheDocument();
  expect(screen.queryByText(/requests sent/i)).toBeNull();
});

test('Should display provided milestones', () => {
  render(<WithMilestones />);
  expect(screen.getByText(/Decision Submitted/i)).toBeInTheDocument();
  expect(screen.getByText(/requests sent/i)).toBeInTheDocument();
  WithMilestones.args?.milestones?.forEach((m) => {
    expect(screen.getByText(m.name)).toBeInTheDocument();
  });
});
