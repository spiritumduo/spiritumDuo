/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ModalPatient, { LOCK_ON_PATHWAY_MUTATION } from 'components/ModalPatient';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Default as DecisionPointDefaultStory, Locked as DecisionPointLockedStory } from 'pages/DecisionPoint.stories';
import { Default as PreviousDecisionPointsStory } from 'pages/PreviousDecisionPoints.stories';

const userHasLockMocks = [
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
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
    },
  },
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
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
    },
  },
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
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
    },
  },
  {
    // UNLOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
          unlock: true,
        },
      },
    },
    result: {
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
    },
  },
];

const userDoesNotHaveLockMocks = [
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
      data: {
        lockOnPathway: {
          onPathway: {
            id: '1',
            lockEndTime: new Date('2030-01-01'),
            lockUser: {
              id: '1000',
              firstName: 'Test-John-2',
              lastName: 'Test-Doe-2',
            },
          },
          userErrors: null,
        },
      },
    },
  },
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
      data: {
        lockOnPathway: {
          onPathway: {
            id: '1',
            lockEndTime: new Date('2030-01-01'),
            lockUser: {
              id: '1000',
              firstName: 'Test-John-2',
              lastName: 'Test-Doe-2',
            },
          },
          userErrors: null,
        },
      },
    },
  },
  {
    // LOCK ONPATHWAY
    request: {
      query: LOCK_ON_PATHWAY_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
        },
      },
    },
    result: {
      data: {
        lockOnPathway: {
          onPathway: {
            id: '1',
            lockEndTime: new Date('2030-01-01'),
            lockUser: {
              id: '1000',
              firstName: 'Test-John-2',
              lastName: 'Test-Doe-2',
            },
          },
          userErrors: null,
        },
      },
    },
  },
];

const mockPatient = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  hospitalNumber: 'fMRN1234567',
};

export default {
  title: 'Components/Modal Patient',
  component: ModalPatient,
  argTypes: { closeCallback: { action: 'clicked' } },
  decorators: [
    (ModalPatientStory) => (
      <MockAuthProvider>
        <MockPathwayProvider>
          <ModalPatientStory />
        </MockPathwayProvider>
      </MockAuthProvider>
    ),
  ],
} as ComponentMeta<typeof ModalPatient>;

const Template: ComponentStory<typeof ModalPatient> = (args) => <ModalPatient { ...args } />;

export const Default = Template.bind({});
Default.args = {
  patient: mockPatient,
  lock: true,
};

Default.parameters = {
  patient: mockPatient,
  apolloClient: {
    mocks: [
      ...userHasLockMocks,
      ...DecisionPointDefaultStory.parameters?.apolloClient.mocks,
      ...PreviousDecisionPointsStory.parameters?.apolloClient.mocks,
    ],
  },
};

export const LockedByOtherUser = Template.bind({});
LockedByOtherUser.args = {
  patient: mockPatient,
  lock: true,
};

LockedByOtherUser.parameters = {
  patient: mockPatient,
  apolloClient: {
    mocks: [
      ...userDoesNotHaveLockMocks,
      ...DecisionPointLockedStory.parameters?.apolloClient.mocks,
      ...PreviousDecisionPointsStory.parameters?.apolloClient.mocks,
    ],
  },
};
