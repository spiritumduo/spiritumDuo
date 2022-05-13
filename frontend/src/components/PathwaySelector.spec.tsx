import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './PathwaySelector.stories';

const { Standard, NoPathways } = composeStories(stories);

it('Should display pathways', () => {
  render(<Standard />);
  expect(screen.getByText(/Lung Cancer/i)).toBeInTheDocument();
  expect(screen.queryByText(/Lung Cancer/i)).not.toBeDisabled();
});

it('Should display notice no pathways available and should be disabled', () => {
  render(<NoPathways />);
  expect(screen.getByText(/No pathways available/i)).toBeInTheDocument();
  expect(screen.queryByText(/No pathways available/i)).toBeDisabled();
});
