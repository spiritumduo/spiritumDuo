/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { fireEvent, render, screen, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './WrappedPatientList.stories';

const { Default } = composeStories(stories);
const renderDefault = async () => {
  jest.useFakeTimers(); // allows us to manipulate setInterval/setTimeout, etc

  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  expect(screen.queryByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    await jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
  jest.useRealTimers(); // cleanup timer changes
};

test('Patient lists should contain patients', async () => {
  const patientsPerPage = Default.args?.patientsToDisplay;
  if (patientsPerPage) {
    await renderDefault();
    await waitFor(() => expect(
      screen.getAllByRole('row').length,
    ).toEqual(patientsPerPage + 1)); // all patients plus header
  } else {
    throw new Error('No patients per page specified in story');
  }
});

test('It should display the last completed milestone alongside the patient', async () => {
  const patientsPerPage = Default.args?.patientsToDisplay;
  await renderDefault();
  await waitFor(() => expect(screen.getAllByText(/third milestone/i).length).toEqual(patientsPerPage));
});

test('It should display lock icons for locked patients', async () => {
  await renderDefault();
  await waitFor(() => expect(screen.getByText(/john 1 doe 1/i)).toBeInTheDocument());
  const lockIcons = screen.getAllByRole('img', { name: /lock icon$/i });
  expect(lockIcons.length).toBe(2);
});

test('Tooltip on hover of lock indicator should display Johnny Locker is locking', async () => {
  await renderDefault();
  expect(screen.queryByText(/locked by Johnny Locker/i)).toBeNull();
  await waitFor(() => expect(screen.getAllByRole('img', { name: /lock icon/i }).length).toBeGreaterThan(0));
  const lockIcons = screen.getAllByRole('img', { name: /lock icon$/i });
  fireEvent.mouseOver(lockIcons[0]);
  await waitFor(() => expect(screen.getByText(/locked by Johnny Locker/i)).toBeInTheDocument());
});

test('Patient lists should paginate', async () => {
  const { click } = userEvent.setup();
  const patients = Default.parameters?.patients;
  const patientsPerPage = Default.args?.patientsToDisplay;
  if (patients && patientsPerPage) {
    await renderDefault();
    const nextLinks = screen.getAllByRole('button', {
      name: (t) => /next/i.test(t),
    });
    expect(nextLinks.length).toEqual(1);
    await waitFor(() => click(nextLinks[0]));
    await waitFor(() => {
      const links = screen.getAllByRole('row');
      expect(links.length).toBe(6); // 5 patients on second page in mock, plus header
    });
  } else {
    throw new Error('No patients in story parameters');
  }
});
