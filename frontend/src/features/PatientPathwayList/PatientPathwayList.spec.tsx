import React from 'react';
import { composeStories } from '@storybook/testing-react';
import { render, waitFor } from '@testing-library/react';
import * as stories from './PatientPathwayList.stories';

const { Default } = composeStories(stories);

it('It should render Default correctly', async () => {
  const { container, getByRole } = render(<Default />);
  await waitFor(() => expect(getByRole('table', { name: /pathway\s+table/i })).toBeInTheDocument());
  expect(container).toMatchSnapshot();
});
