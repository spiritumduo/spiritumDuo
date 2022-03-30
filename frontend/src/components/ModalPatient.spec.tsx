/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { waitFor, render, screen, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { DocumentNode } from '@apollo/client';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { RequestHandler } from 'mock-apollo-client';
import { GET_PATIENT_QUERY } from 'pages/DecisionPoint';
import { Default as DecisionPointDefaultStory } from 'pages/DecisionPoint.stories';
import { LOCK_ON_PATHWAY_MUTATION } from './ModalPatient';
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
    ];
    await waitFor(() => {
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
        // eslint-disable-next-line arrow-body-style
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
    ];
    await waitFor(() => {
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
