import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './WrappedPatientList.stories';

const { Default } = composeStories(stories);
const renderDefault = () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
};

test('Patient lists should display loading', () => {
  renderDefault();
  expect(screen.getByText('Loading!')).toBeInTheDocument();
});

test('Patient lists should contain patients', async () => {
  const patientsPerPage = Default.args?.patientsToDisplay;
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

test('It should display the last completed milestone alongside the patient', async () => {
  const patientsPerPage = Default.args?.patientsToDisplay;
  renderDefault();
  await waitFor(() => expect(screen.getAllByText(/third milestone/i).length).toEqual(patientsPerPage));
});

test('Tooltip on hover of lock indicator should display Johnny Locker is locking', async () => {
  renderDefault();
  expect(screen.queryByText(/locked by Johnny Locker/i)).toBeNull();
  await waitFor(() => expect(screen.getByTestId('lock-icon-0')).toBeInTheDocument());
  fireEvent.mouseOver(screen.getByTestId('lock-icon-0'));
  expect(await screen.findByText(/locked by Johnny Locker/i)).toBeInTheDocument();
});

test('Patient lists should paginate', async () => {
  const patients = Default.parameters?.patients;
  const patientsPerPage = Default.args?.patientsToDisplay;
  if (patients && patientsPerPage) {
    renderDefault();
    await waitFor(() => expect(screen.getByText('Loading!')).toBeInTheDocument());
    const nextLinks = screen.getAllByRole('button', {
      name: (t) => /next/i.test(t),
    });
    expect(nextLinks.length).toEqual(1);
    userEvent.click(nextLinks[0]);
    await waitFor(() => {
      const links = screen.getAllByRole('row');
      expect(links.length).toBe(6); // 5 patients on second page in mock, plus header
    });
  } else {
    throw new Error('No patients in story parameters');
  }
});
