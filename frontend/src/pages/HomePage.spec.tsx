/* eslint-disable comma-dangle */
import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './HomePage.stories';

const { Default } = composeStories(stories);
const renderDefault = () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>
  );
};

test('Patient lists should display loading', () => {
  renderDefault();
  expect(screen.getAllByText('Loading!').length).toEqual(2);
});

test('Patient lists should contain patients', async () => {
  const patientsPerPage = Default.args?.patientsPerPage;
  if (patientsPerPage) {
    renderDefault();
    await waitFor(
      () => expect(
        screen.getAllByRole('link', {
          name: (t, _) => /MRN123456/i.test(t)
        }).length
      ).toEqual(2 * patientsPerPage)
    );
  } else {
    throw new Error('No patients per page specified in story');
  }
});

test('Patient lists should paginate', async () => {
  const patients = Default.parameters?.patients;
  const patientsPerPage = Default.args?.patientsPerPage;
  if (patients && patientsPerPage) {
    renderDefault();
    await waitFor(() => expect(screen.getAllByText('Loading!').length).toEqual(2));
    const nextLinks = screen.getAllByRole('button', {
      name: (t, _) => /next/i.test(t)
    });
    expect(nextLinks.length).toEqual(2);
    userEvent.click(nextLinks[0]);
    userEvent.click(nextLinks[1]);
    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: (t, _) => /john\s+doe\s[12][0-9]/i.test(t) })
      expect(links.length).toBe(2 * patientsPerPage);
    });
  } else {
    throw new Error('No patients in story parameters');
  }
});
