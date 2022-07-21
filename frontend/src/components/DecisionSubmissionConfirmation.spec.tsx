/* eslint-disable comma-dangle */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DecisionSubmissionConfirmation.stories';

const { Default, WithClinicalRequestsAndConfirmations } = composeStories(stories);

test('Should display when no clinicalRequests', () => {
  render(<Default />);
  expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument();
  expect(screen.queryByText(/requests sent/i)).toBeNull();
});

test('Should display provided clinicalRequests', () => {
  render(<WithClinicalRequestsAndConfirmations />);
  expect(screen.getByText(/Requests:/i)).toBeInTheDocument();
  WithClinicalRequestsAndConfirmations.args?.clinicalRequests?.forEach((m) => {
    expect(screen.getByText(m.name)).toBeInTheDocument();
  });
});

test('Should display provided resolutions', () => {
  render(<WithClinicalRequestsAndConfirmations />);
  expect(screen.getByText(/By clicking 'OK' you are acknowledging:/i)).toBeInTheDocument();
  WithClinicalRequestsAndConfirmations.args?.clinicalRequestResolutions?.forEach((m) => {
    expect(screen.getByText(m)).toBeInTheDocument();
  });
});
