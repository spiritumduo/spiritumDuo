import React from 'react';
import { composeStories } from '@storybook/testing-react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from './PatientPathwayList.stories';

const { Default } = composeStories(stories);

const renderDefault = () => render(<Default />);

it('It should render Default correctly', async () => {
  const { container, getByRole } = renderDefault();
  await waitFor(() => expect(getByRole('table', { name: /pathway\s+table/i })).toBeInTheDocument());
  expect(container).toMatchSnapshot();
});

test('Patient lists should paginate', async () => {
  const { getAllByRole } = renderDefault();
  const { click } = userEvent.setup();
  const nextLinks = await waitFor(() => getAllByRole('button', { name: /next/i }));
  expect(nextLinks.length).toEqual(1);
  await waitFor(() => click(nextLinks[0]));
  await waitFor(() => {
    const links = getAllByRole('link', { name: /john\s+doe/i });
    expect(links.length).toBe(5);
  });
  await waitFor(() => click(nextLinks[0]));
  await waitFor(() => {
    const links = getAllByRole('link', { name: /john\s+doe/i });
    expect(links.length).toBe(2);
  });
});
