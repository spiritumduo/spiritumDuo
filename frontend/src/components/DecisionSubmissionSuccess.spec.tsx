/* eslint-disable comma-dangle */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DecisionSubmissionSuccess.stories';

const { Default, WithClinicalRequestsAndConfirmations } = composeStories(stories);

test('Should display when no clinicalRequests', () => {
  render(<Default />);
  expect(screen.getByText(/Decision Submitted/i)).toBeInTheDocument();
  expect(screen.queryByText(/requests sent/i)).toBeNull();
});

test('Should display provided clinicalRequests', () => {
  render(<WithClinicalRequestsAndConfirmations />);
  expect(screen.getByText(/Requests sent/i)).toBeInTheDocument();
  WithClinicalRequestsAndConfirmations.args?.clinicalRequests?.forEach((m) => {
    expect(screen.getByText(m.name)).toBeInTheDocument();
  });
});

test('Should display provided resolutions', () => {
  render(<WithClinicalRequestsAndConfirmations />);
  expect(screen.getByText(/These results have now been acknowledged:/i)).toBeInTheDocument();
  WithClinicalRequestsAndConfirmations.args?.clinicalRequestResolutions?.forEach((m) => {
    expect(screen.getByText(m)).toBeInTheDocument();
  });
});
