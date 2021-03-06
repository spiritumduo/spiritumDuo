import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './PathwayComplete.stories';

const { Default } = composeStories(stories);

it('Should display pathway completed', () => {
  render(<Default />);
  expect(screen.getByText(/Congratulations on completing the pathway for this patient!/i)).toBeInTheDocument();
});
