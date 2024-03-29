/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { waitFor, render, screen, cleanup, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

// APP
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import store from 'app/store';
import MockConfigProvider from 'test/mocks/mockConfig';

// COMPONENTS
import { Default as PreviousDecisionPointsStory } from 'pages/PreviousDecisionPoints.stories';
import { Default as DecisionPointsStory } from 'features/DecisionPoint/DecisionPoint.stories';

// LOCAL IMPORTS
import ModalPatient, { LOCK_ON_PATHWAY_MUTATION } from './ModalPatient';
import * as stories from './ModalPatient.stories';

const { Default } = composeStories(stories);

async function renderWithTestMocks() {
  jest.useFakeTimers();

  const mocks = [
    {
      query: LOCK_ON_PATHWAY_MUTATION,
      mockFn: jest.fn().mockResolvedValue({
        data: {
          lockOnPathway: {
            id: '1',
            onPathway: {
              id: '1',
              lockEndTime: new Date('2030-01-01'),
              lockUser: {
                id: '1',
                firstName: 'John',
                lastName: 'Tester',
              },
            },
            userErrors: null,
          },
        },
      }),
    },
    Default.parameters?.patientMock,
    DecisionPointsStory.parameters?.createDecisionMock,
    DecisionPointsStory.parameters?.getPatientMock,
    DecisionPointsStory.parameters?.getMdtsMock,
    PreviousDecisionPointsStory.parameters?.getPatientMock,
  ];

  render(
    <Provider store={ store }>
      <MockAuthProvider>
        <MockPathwayProvider>
          <MockConfigProvider>
            <NewMockSdApolloProvider mocks={ mocks }>
              <ModalPatient
                hospitalNumber={ Default.parameters?.patient.hospitalNumber }
                closeCallback={ () => ({}) }
                lock
              />
            </NewMockSdApolloProvider>
          </MockConfigProvider>
        </MockPathwayProvider>
      </MockAuthProvider>
    </Provider>,
  );
  expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();

  jest.useRealTimers();
  return mocks;
}

async function renderDefaultNoClinicalRequests() {
  jest.useFakeTimers();
  render(
    <MockConfigProvider>
      <Default />
    </MockConfigProvider>,
  );
  expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });

  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();

  jest.useRealTimers();

  const { click, keyboard } = userEvent.setup();

  const clinicalHistoryText = '{Control>}A{/Control}New Clinic History';
  const comorbiditiesText = '{Control>}A{/Control}New Comorbidities';
  // wait for page to render fully
  await waitFor(() => expect(
    screen.getByRole('button', { name: 'Submit' }),
  ).toBeInTheDocument());
  await waitFor(() => expect(
    screen.getByLabelText('Clinical history'),
  ).toBeInTheDocument());
  await waitFor(() => expect(
    screen.getByLabelText('Co-morbidities'),
  ).toBeInTheDocument());

  await act(async () => {
    await click(screen.getByLabelText('Clinical history'));
    await keyboard(clinicalHistoryText);
    await click(screen.getByLabelText('Co-morbidities'));
    await keyboard(comorbiditiesText);
  });
}

describe('When page loads and user gets the lock', () => {
  // it('Should display the patient\'s name', async () => {
  //   await renderWithTestMocks();
  //   const patient = Default.parameters?.patient;
  //   await waitFor(() => {
  //     expect(screen.getByText(
  //       new RegExp(`${patient.firstName}\\s${patient.lastName}`, 'i'),
  //     )).toBeInTheDocument();
  //   });
  //   await waitFor(() => expect(screen.queryByTex
  // t(/loading animation/i)).not.toBeInTheDocument());
  //   jest.useRealTimers();
  // });

  it('Should display the patient\'s demographic information', async () => {
    await renderWithTestMocks();
    const patient = Default.parameters?.patient;
    // Victoria Robles, fMRN: 1234567L, fNHS: 123-456-78L, 16/07/1969
    await waitFor(() => {
      expect(screen.getByText(
        new RegExp(`${patient.firstName} ${patient.lastName}, fMRN: 1234567L, fNHS: 123-456-78L, ${patient.dateOfBirth.toLocaleDateString()}`, 'i'),
      )).toBeInTheDocument();
    });
  });

  it('Should display the New Decision tab', async () => {
    await renderWithTestMocks();
    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
  });

  it('Should send the lock mutation', async () => {
    const mocks = await renderWithTestMocks();
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledTimes(1));
  });

  it('Should send the unlock mutation once when component unmounted', async () => {
    const mocks = await renderWithTestMocks();
    cleanup();
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledWith({
      input: {
        onPathwayId: '1',
        unlock: true,
      },
    }));
  });
});

describe('When the page loads and the user does not get the lock', () => {
  it('Should display the patient', async () => {
    await renderWithTestMocks();

    const patient = Default.parameters?.patient;
    expect(screen.getByText(
      new RegExp(`${patient.firstName}\\s${patient.lastName}`, 'i'),
    )).toBeInTheDocument();
  });

  it('Should display the New Decision tab in a locked state', async () => {
    await renderWithTestMocks();
    await waitFor(() => expect(screen.getByText(/this patient is locked/i)).toBeInTheDocument());
  });

  it('Should not send the unlock mutation on unmount', async () => {
    const mocks = await renderWithTestMocks();
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledTimes(1));
    cleanup();
    expect(mocks[0].mockFn).toBeCalledTimes(2);
    expect(mocks[0].mockFn).toBeCalledWith({
      input: {
        onPathwayId: '1',
      },
    });
  });
});

describe('When page loads and a user submits a decision without clinicalRequests', () => {
  it('Should warn the user when they submit', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument());
  });

  it('Should succeed when they click submit', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument());

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument());
  });

  it('Should return to the decision page when the user cancels', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument());

    await waitFor(() => click(screen.getByRole('button', { name: 'Cancel' })));
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /clinical history/i })).toBeInTheDocument();
    });
  });

  it('Should display test results that have been acknowledged', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument());
    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));

    await waitFor(() => {
      expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Lung function/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/pet-ct/i).length).toBeGreaterThan(0);
    });
  });

  it('Should disable the tabs', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();
    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('Should re-enable the tabs when the user cancels', async () => {
    await renderDefaultNoClinicalRequests();
    const { click } = userEvent.setup();
    await waitFor(() => click(screen.getByRole('button', { name: 'Close' })));
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'false');
      expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'false');
    });
  });
});

async function renderDefaultWithClinicalRequests() {
  const { click, keyboard } = userEvent.setup();
  jest.useFakeTimers();
  act(() => {
    render(<Default />);
    jest.advanceTimersByTime(500);
  });
  jest.setSystemTime(Date.now() + 10000);

  // wait for page to render fully
  await waitFor(() => expect(
    screen.getByLabelText('Clinical history'),
  ).toBeInTheDocument());

  await waitFor(() => {
    click(screen.getByLabelText('Clinical history'));
    keyboard('{Control>}A{/Control}New Clinic History');
    click(screen.getByLabelText('Co-morbidities'));
    keyboard('{Control>}A{/Control}New Comorbidities');
  });

  jest.useRealTimers();
}

describe('When page loads and a user submits a decision with clinicalRequests', () => {
  it('Should ask for confirmation', async () => {
    const { click, keyboard, selectOptions } = userEvent.setup();
    await renderDefaultWithClinicalRequests();

    await waitFor(() => expect(screen.queryAllByRole('checkbox')).not.toHaveLength(0));

    screen.queryAllByRole('checkbox').forEach((cb) => click(cb));

    await waitFor(() => {
      expect(screen.getByLabelText(/mdt session/i));
      expect(screen.getByLabelText(/discussion points/i));
    });

    await click(screen.getByLabelText(/discussion points/i));
    await keyboard('test data goes brrrt');
    await waitFor(() => selectOptions(screen.getByLabelText(/mdt session/i), ['1']));

    await click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(screen.getByText(/submit these requests\?/i)).toBeInTheDocument());
  });

  it('Should succeed when user confirms submission', async () => {
    const { click, keyboard, selectOptions } = userEvent.setup();
    await renderDefaultWithClinicalRequests();

    await waitFor(() => {
      expect(screen.queryAllByRole('checkbox')).not.toHaveLength(0);
    });

    screen.queryAllByRole('checkbox').forEach((cb) => click(cb));

    await waitFor(() => {
      expect(screen.getByLabelText(/mdt session/i));
      expect(screen.getByLabelText(/discussion points/i));
    });

    await click(screen.getByLabelText(/discussion points/i));
    await keyboard('test data goes brrrt');
    await waitFor(() => selectOptions(screen.getByLabelText(/mdt session/i), ['1']));

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument());
    await waitFor(() => click(screen.getByRole('button', { name: 'OK' })));
    await waitFor(() => expect(screen.getByText(/Your decision has now been submitted/i)).toBeInTheDocument());
  });

  it('Should return to the decision page when the user cancels', async () => {
    const { click, keyboard, selectOptions } = userEvent.setup();
    await renderDefaultWithClinicalRequests();

    await waitFor(() => expect(screen.queryAllByRole('checkbox')).not.toHaveLength(0));

    screen.queryAllByRole('checkbox').forEach((cb) => click(cb));

    await waitFor(() => {
      expect(screen.getByLabelText(/mdt session/i));
      expect(screen.getByLabelText(/discussion points/i));
    });

    await waitFor(() => click(screen.getByLabelText(/discussion points/i)));
    await waitFor(() => keyboard('test data goes brrrt'));
    await waitFor(() => selectOptions(screen.getByLabelText(/mdt session/i), ['1']));

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument());
    await waitFor(() => click(screen.getByRole('button', { name: 'Cancel' })));
    expect(screen.getByRole('textbox', { name: /clinical history/i })).toBeInTheDocument();
  });

  it('Should disable tabs', async () => {
    const { click, keyboard, selectOptions } = userEvent.setup();
    await renderDefaultWithClinicalRequests();

    await waitFor(() => {
      expect(screen.queryAllByRole('checkbox')).not.toHaveLength(0);
    });

    screen.queryAllByRole('checkbox').forEach((cb) => click(cb));

    await waitFor(() => {
      expect(screen.getByLabelText(/mdt session/i));
      expect(screen.getByLabelText(/discussion points/i));
    });

    await waitFor(() => click(screen.getByLabelText(/discussion points/i)));
    await waitFor(() => keyboard('test data goes brrrt'));
    await waitFor(() => selectOptions(screen.getByLabelText(/mdt session/i), ['1']));

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument());
    expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('Should re-enable the tabs when the user cancels', async () => {
    const { click, keyboard, selectOptions } = userEvent.setup();
    await renderDefaultWithClinicalRequests();

    await waitFor(() => {
      expect(screen.queryAllByRole('checkbox')).not.toHaveLength(0);
    });

    screen.queryAllByRole('checkbox').forEach((cb) => click(cb));

    await waitFor(() => {
      expect(screen.getByLabelText(/mdt session/i));
      expect(screen.getByLabelText(/discussion points/i));
    });

    await waitFor(() => click(screen.getByLabelText(/discussion points/i)));
    await waitFor(() => keyboard('test data goes brrrt'));
    await waitFor(() => selectOptions(screen.getByLabelText(/mdt session/i), ['1']));

    await waitFor(() => click(screen.getByRole('button', { name: 'Submit' })));
    await waitFor(() => expect(screen.getByText(/Submit these requests/i)).toBeInTheDocument());
    await waitFor(() => click(screen.getByRole('button', { name: 'Cancel' })));
    expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'false');
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'false');
  });
});
