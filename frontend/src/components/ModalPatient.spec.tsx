/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { waitFor, render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { DocumentNode } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import { RequestHandler } from 'mock-apollo-client';

// APP
import MockSdApolloProvider, { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

// COMPONENTS
import { GET_PATIENT_QUERY } from 'pages/DecisionPoint';
import { Default as DecisionPointDefaultStory } from 'pages/DecisionPoint.stories';

// LOCAL IMPORTS
import { LOCK_ON_PATHWAY_MUTATION, GET_PATIENT_CURRENT_PATHWAY_QUERY } from './ModalPatient';
import * as stories from './ModalPatient.stories';

const { Default } = composeStories(stories);
const getPatientMock = {
  query: GET_PATIENT_QUERY,
  mockFn: () => Promise.resolve(
    // this is pretty bad, and something we need to clean up in transition away
    // from MockedProvider
    DecisionPointDefaultStory.parameters?.apolloClient.mocks[0].result,
  ),
};

const getPatientCurrentPathwayMock = {
  query: GET_PATIENT_CURRENT_PATHWAY_QUERY,
  mockFn: () => Promise.resolve({
    data: {
      getPatient: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        onPathways: [{
          id: '1',
        }],
      },
    },
  }),
};

describe('When page loads and user gets the lock', () => {
  let mocks: {
    query: DocumentNode;
    mockFn: RequestHandler<any, any>;
  }[];
  beforeEach( async () => {
    mocks = [
      {
        query: LOCK_ON_PATHWAY_MUTATION,
        // eslint-disable-next-line arrow-body-style
        mockFn: jest.fn().mockImplementation(({ input: { unlock } }) => {
          if (unlock) {
            return Promise.resolve({
              data: {
                lockOnPathway: {
                  id: '1',
                  onPathway: {
                    id: '1',
                    lockEndTime: null,
                    lockUser: null,
                  },
                  userErrors: null,
                },
              },
            });
          }
          return Promise.resolve({
            data: {
              lockOnPathway: {
                onPathway: {
                  id: '1',
                  lockEndTime: new Date('2030-01-01'),
                  lockUser: {
                    id: '1',
                    firstName: 'Test-John',
                    lastName: 'Test-Doe',
                    username: 'test-john-doe',
                  },
                },
                userErrors: null,
              },
            },
          });
        }),
      },
      getPatientMock,
      getPatientCurrentPathwayMock,
    ];
    await act(async () => {
      render(
        <NewMockSdApolloProvider mocks={ mocks }>
          <Default />
        </NewMockSdApolloProvider>,
      );
    });
  });

  it('Should display the patient', async () => {
    const patient = Default.parameters?.patient;
    await waitFor(() => {
      expect(screen.getByText(
        new RegExp(`${patient.firstName}\\s${patient.lastName}.+${patient.hospitalNumber}`, 'i'),
      )).toBeInTheDocument();
    });
  });

  it('Should display the New Decision tab', async () => {
    await waitFor(() => expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument());
  });

  it('Should send the lock mutation', () => {
    expect(mocks[0].mockFn).toBeCalledTimes(1);
  });

  it('Should send the unlock mutation once when component unmounted', async () => {
    cleanup();
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledTimes(2));
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledWith({
      input: {
        unlock: true,
        onPathwayId: '1',
      },
    }));
  });
});

describe('When the page loads and the user does not get the lock', () => {
  let mocks: {
    query: DocumentNode;
    mockFn: RequestHandler<any, any>;
  }[];
  beforeEach(async () => {
    mocks = [
      {
        query: LOCK_ON_PATHWAY_MUTATION,
        mockFn: jest.fn().mockResolvedValue({
          data: {
            lockOnPathway: {
              onPathway: {
                id: '1',
                lockEndTime: new Date('2030-01-01'),
                lockUser: {
                  id: '1000',
                  firstName: 'Test-John',
                  lastName: 'Test-Doe',
                  username: 'test-john-doe',
                },
              },
              userErrors: null,
            },
          },
        }),
      },
      getPatientMock,
      getPatientCurrentPathwayMock,
    ];
    await act(async () => {
      render(
        <NewMockSdApolloProvider mocks={ mocks }>
          <Default />
        </NewMockSdApolloProvider>,
      );
    });
  });

  it('Should display the patient', () => {
    const patient = Default.parameters?.patient;
    expect(screen.getByText(
      new RegExp(`${patient.firstName}\\s${patient.lastName}.+${patient.hospitalNumber}`, 'i'),
    )).toBeInTheDocument();
  });

  it('Should display the New Decision tab in a locked state', async () => {
    await waitFor(() => expect(screen.getByText(/this patient is locked/i)).toBeInTheDocument());
  });

  it('Should not send the unlock mutation on unmount', async () => {
    cleanup();
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledTimes(1));
    await waitFor(() => expect(mocks[0].mockFn).toBeCalledWith({
      input: {
        onPathwayId: '1',
      },
    }));
  });
});

describe('When page loads and a user submits a decision without milestones', () => {
  // let tabState: boolean;
  beforeEach( async () => {
    const { click, keyboard } = userEvent.setup();
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
    const clinicalHistoryText = '{Control>}A{/Control}New Clinic History';
    const comorbiditiesText = '{Control>}A{/Control}New Comorbidities';
    // wait for page to render fully
    await waitFor(() => expect(
      screen.getByRole('button', { name: 'Submit' }),
    ).toBeInTheDocument());
    await waitFor(() => click(screen.getByLabelText('Clinical history')));
    await waitFor(() => keyboard(clinicalHistoryText));
    await waitFor(() => click(screen.getByLabelText('Co-morbidities')));
    await waitFor(() => keyboard(comorbiditiesText));
    click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByText(/No requests have been selected/i)).toBeInTheDocument());
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
    expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('Should re-enable the tabs when the user cancels', () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('tab', { name: /new decision/i })).toBeEnabled();
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toBeEnabled();
  });
});

describe('When page loads and a user submits a decision with milestones', () => {
  beforeEach( async () => {
    const { click, keyboard } = userEvent.setup();
    render(
      <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
        <Default />
      </MockSdApolloProvider>,
    );
    const clinicalHistoryText = '{Control>}A{/Control}New Clinic History';
    const comorbiditiesText = '{Control>}A{/Control}New Comorbidities';
    // wait for page to render fully
    await waitFor(() => expect(
      screen.getByRole('button', { name: 'Submit' }),
    ).toBeInTheDocument());
    await waitFor(() => click(screen.getByLabelText('Clinical history')));
    await waitFor(() => keyboard(clinicalHistoryText));
    await waitFor(() => click(screen.getByLabelText('Co-morbidities')));
    await waitFor(() => keyboard(comorbiditiesText));
    await waitFor(() => {
      const requestCheckboxes = screen.getAllByRole('checkbox');
      requestCheckboxes.forEach((cb) => click(cb));
      click(screen.getByRole('button', { name: 'Submit' }));
    });
    await waitFor(() => expect(screen.getByText(/Submit these requests\?/i)).toBeInTheDocument());
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
    expect(screen.getByRole('tab', { name: /new decision/i })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('Should re-enable the tabs when the user cancels', () => {
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('tab', { name: /new decision/i })).toBeEnabled();
    expect(screen.getByRole('tab', { name: /previous decisions/i })).toBeEnabled();
  });
});
