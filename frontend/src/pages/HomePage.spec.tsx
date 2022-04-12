/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { waitFor, render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'app/store';
import * as stories from './HomePage.stories';

const { Default } = composeStories(stories);
const renderDefault = () => {
  render(
    <Provider store={ store }>
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>
    </Provider>,
  );
};

test('Patient lists should display loading', () => {
  renderDefault();
  expect(screen.getByText('Loading!')).toBeInTheDocument();
});

test('Patient lists should contain patients', async () => {
  const patientsPerPage = Default.args?.patientsPerPage;
  if (patientsPerPage) {
    renderDefault();
    await waitFor(
      () => expect(
        screen.getAllByRole('row').length,
      ).toEqual(patientsPerPage + 1), // all patients plus header
    );
  } else {
    throw new Error('No patients per page specified in story');
  }
});

test('Patient lists should paginate', async () => {
  const { click } = userEvent.setup();
  const patients = Default.parameters?.patients;
  const patientsPerPage = Default.args?.patientsPerPage;
  if (patients && patientsPerPage) {
    renderDefault();
    await waitFor(() => expect(screen.getByText('Loading!')).toBeInTheDocument());
    const nextLinks = screen.getAllByRole('button', {
      name: (t) => /next/i.test(t),
    });
    expect(nextLinks.length).toEqual(1);
    await waitFor(() => click(nextLinks[0]));
    await waitFor(() => {
      const tableRows = screen.getAllByRole('row');
      expect(tableRows.length).toBe(6); // 5 patients on second page in mock, plus header
    });
  } else {
    throw new Error('No patients in story parameters');
  }
});

test('Unlocked patients should be clickable', async () => {
  const { click } = userEvent.setup();
  renderDefault();
  await waitFor(() => expect(screen.getByText(/john 1 doe 1/i)).toBeInTheDocument());
  const table = screen.getByRole('grid', { name: /patient list/i });
  const rows = within(table).getAllByRole('row');
  // eslint-disable-next-line no-restricted-syntax
  for (const r of rows) {
    const locks = within(r).queryAllByRole('img', { name: /lock icon/i });
    if (locks.length === 0) {
      const button = within(r).queryByRole('button');
      if (button) {
        await waitFor(() => click(button));
        // eslint-disable-next-line no-loop-func
        await waitFor(() => expect(screen.getByText(/new decision/i)).toBeInTheDocument());
        await waitFor(() => click(screen.getByRole('button', { name: /close/i })));
      }
    }
  }
});

test('Locked patients should be disabled', async () => {
  const { click } = userEvent.setup();
  renderDefault();
  await waitFor(() => expect(screen.getByText(/john 1 doe 1/i)).toBeInTheDocument());
  const table = screen.getByRole('grid', { name: /patient list/i });
  const rows = within(table).getAllByRole('row');
  // eslint-disable-next-line no-restricted-syntax
  for (const r of rows) {
    const locks = within(r).queryAllByRole('img', { name: /lock icon/i });
    if (locks.length === 0) {
      const button = within(r).queryByRole('button');
      if (button) {
        await waitFor(() => click(button));
        // eslint-disable-next-line no-loop-func
        await waitFor(() => expect(screen.getByText(/new decision/i)).toBeNull());
      }
    }
  }
});
