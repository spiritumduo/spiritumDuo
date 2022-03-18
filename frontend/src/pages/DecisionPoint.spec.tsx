import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
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

  it('Should display the last clinical history', async () => {
    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /clinical history/i }) as HTMLTextAreaElement).value,
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

  it('Should display previous test results', async () => {
    await waitFor(() => {
      Default.parameters?.milestones.forEach((ms) => {
        if (ms.testResult) {
          expect(screen.getAllByRole('cell', {
            name: new RegExp(ms.milestoneType.name, 'i'),
          }).length).toBeGreaterThan(0);
          expect(screen.getByRole('cell', {
            name: new RegExp(ms.testResult.description.slice(0, 75), 'i'),
          })).toBeVisible();
        }
      });
    });
  });

  it('Should open test results when clicked', () => {
    // This probably requires visual regression testing, because getting computed CSS
    // in jest-dom is hard
    expect(false).toBeTruthy();
  });

  it('Should show clinician under care of', async () => {
    const clinician = Default
      .parameters?.apolloClient.mocks[0]
      .result.data.getPatient.onPathways?.[0].underCareOf;
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`under care of:\\s${clinician.firstName}\\s${clinician.lastName}`, 'i')));
    });
  });
});

describe('When page loads and a user submits the form without milestones', () => {
  let mockTabStateCallback: jest.Mock<(state: boolean) => void>;
  beforeEach( async () => {
    mockTabStateCallback = jest.fn();
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default tabStateCallback={ mockTabStateCallback } />
      </MockSdApolloProvider>,
    );
    const clinicalHistoryText = '{selectall}New Clinic History';
    const comorbiditiesText = '{selectall}New Comorbidities';
    // wait for page to render fully
    await waitFor(() => expect(
      screen.getByText((t) => /submit/i.test(t)),
    ).toBeInTheDocument());
    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Clinical history'), clinicalHistoryText);
      userEvent.type(screen.getByLabelText('Co-morbidities'), comorbiditiesText);
    });
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Submit' })));
  });

  it('Should warn the user when they submit', async () => {
    expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument();
  });

  it('Should succed when they click submit', async () => {
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument());
  });

  it('Should return to the decision page when the user cancels', async () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /clinical history/i })).toBeInTheDocument();
    });
  });

  it('Should display test results that have been acknowledged', async () => {
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Submit' })));
    // This is from milestones 6 & 7 in the stories.
    await waitFor(() => {
      expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/Lung function/i)).toBeInTheDocument();
      expect(screen.getByText(/pet-ct/i)).toBeInTheDocument();
    });
  });

  it('Should disable the tabs', () => {
    expect(mockTabStateCallback.mock.calls.length).toBeGreaterThanOrEqual(1);
    mockTabStateCallback.mock.calls.forEach((m) => expect(m).toBeTruthy());
  });

  it('Should re-enable the tabs when the user cancels', () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    const mockLength = mockTabStateCallback.mock.calls.length;
    expect(mockLength).toBeGreaterThanOrEqual(2);
    expect(mockTabStateCallback.mock.calls[mockLength - 1][0]).toBeFalsy();
  });
});

describe('When page loads and a user submits the form with milestones', () =>{
  let mockTabStateCallback: jest.Mock<(state: boolean) => void>;
  beforeEach( async () => {
    mockTabStateCallback = jest.fn();
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default tabStateCallback={ mockTabStateCallback } />
      </MockSdApolloProvider>,
    );
    const clinicalHistoryText = '{selectall}New Clinic History';
    const comorbiditiesText = '{selectall}New Comorbidities';
    // wait for page to render fully
    await waitFor(() => expect(
      screen.getByText((t) => /submit/i.test(t)),
    ).toBeInTheDocument());
    await waitFor(() => {
      userEvent.type(screen.getByLabelText('Clinical history'), clinicalHistoryText);
      userEvent.type(screen.getByLabelText('Co-morbidities'), comorbiditiesText);
      const requestCheckboxes = screen.getAllByRole('checkbox');
      requestCheckboxes.forEach((cb) => userEvent.click(cb));
      userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });
  });

  it('Should ask for confirmation', () => {
    expect(screen.getByText(/Submit these requests\?/i)).toBeInTheDocument();
  });

  it('Should succeed when user confirms submission', async () => {
    userEvent.click(screen.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument());
  });

  it('Should return to the decision page when the user cancels', async () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /clinical history/i })).toBeInTheDocument();
    });
  });

  it('Should disable the tabs', () => {
    expect(mockTabStateCallback.mock.calls.length).toBeGreaterThanOrEqual(1);
    mockTabStateCallback.mock.calls.forEach((m) => expect(m).toBeTruthy());
  });

  it('Should re-enable the tabs when the user cancels', () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    const mockLength = mockTabStateCallback.mock.calls.length;
    expect(mockLength).toBeGreaterThanOrEqual(2);
    expect(mockTabStateCallback.mock.calls[mockLength - 1][0]).toBeFalsy();
  });
});
