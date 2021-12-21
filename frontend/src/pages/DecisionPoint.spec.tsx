import React, { useContext } from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import { AuthContext, PathwayContext } from 'app/context';
import * as stories from './DecisionPoint.stories';

const { Default } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(() => {
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
  });

  it('Should display the hospital number', async () => {
    const hospitalNumber = Default
      .parameters?.apolloClient.mocks[0]
      .result.data.getPatient.hospitalNumber;
    if (!hospitalNumber) throw new Error('No hospital number in mock');
    // Match ONE element with hospital number at the start and other text after
    await waitFor(
      () => expect(screen.getByText(
        (t) => new RegExp(`^${hospitalNumber}.+`).test(t),
      )).toBeInTheDocument(),
    );
  });

  it('Should display the first and last name', async () => {
    const firstName = Default
      .parameters?.apolloClient.mocks[0]
      .result.data.getPatient.firstName;
    if (!firstName) throw new Error('No first name in mock');
    const lastName = Default
      .parameters?.apolloClient.mocks[0]
      .result.data.getPatient.lastName;
    if (!lastName) throw new Error('No last name in mock');
    // Match ONE element that has first and last name, seperated by whitespace
    // with possible text before and after
    await waitFor(
      () => expect(screen.getByText(
        (t) => new RegExp(`.+${firstName}\\s+${lastName}.+`).test(t),
      )).toBeInTheDocument(),
    );
  });

  it('Should display the last clinical history', async () => {
    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /clinical history/i }) as HTMLInputElement).value,
      ).toMatch(/clinic history 1/i),
    );
  });

  it('Should display the last comorbidities', async () => {
    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /co-morbidities/i }) as HTMLInputElement).value,
      ).toMatch(/comorbidities 1/i),
    );
  });

  it('Should report success on form submission', async () => {
    const clinicalHistoryText = '{selectall}New Clinic History';
    const comorbiditiesText = '{selectall}New Comorbidities';
    // wait for page to render fully
    await waitFor(() => expect(
      screen.getByText((t) => /edit patient record/i.test(t)),
    ).toBeInTheDocument());
    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Clinical history'), clinicalHistoryText);
      userEvent.type(screen.getByLabelText('Co-morbidities'), comorbiditiesText);
      userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    await waitFor(() => expect(screen.getByText('Success!')).toBeInTheDocument());
  });
});
