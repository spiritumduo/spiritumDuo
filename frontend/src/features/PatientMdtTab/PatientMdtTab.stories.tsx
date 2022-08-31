import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import PatientMdtTab, {
  GET_PATIENT_ON_MDT_CONNECTION_QUERY,
  LOCK_ON_MDT_MUTATION,
  UPDATE_ON_MDT_MUTATION,
} from './PatientMdtTab';
import { ClinicalRequestState } from '__generated__/globalTypes';

const lockOnMdtSuccessResult = {
  onMdt: {
    id: '1',
    lockEndTime: '3000-01-01T00:00:00',
    lockUser: {
      id: '1',
      username: 'testuser',
      firstName: 'test',
      lastName: 'user',
    },
  },
  userErrors: null,
};

const lockOnMdtFailResult = {
  onMdt: {
    id: '1',
    lockEndTime: '3000-01-01T00:00:00',
    lockUser: {
      id: '2',
      username: 'anothertestuser',
      firstName: 'anothertest',
      lastName: 'user',
    },
  },
  userErrors: [{
    field: 'lock_user_id',
    message: 'locked by someone else',
  }],
};

const getPatientOnMdtResult = {
  totalCount: 1,
  pageInfo: {
    hasNextPage: false,
    endCursor: '1',
  },
  edges: [{
    cursor: '1',
    node: {
      id: '1',
      outcome: 'outcomes goes here',
      reason: 'review reason goes here',
      actioned: true,
      clinicalRequest: {
        id: '1',
        currentState: ClinicalRequestState.COMPLETED
      },
      mdt: {
        id: '1',
        plannedAt: '3000-01-01T00:00:00',
        creator: {
          id: '1',
          firstName: 'test',
          lastName: 'user',
        },
      },
    },
  }],
};

const updateOnMdtSuccessResult = {
  onMdt: {
    id: '1',
  },
  userErrors: null,
};

const updateOnMdtErrorResult = {
  onMdt: null,
  userErrors: [{
    field: 'error',
    message: 'an error occured',
  }],
};

const successMocks = [
  {
    query: GET_PATIENT_ON_MDT_CONNECTION_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getOnMdtConnection: getPatientOnMdtResult,
      },
    }),
  },
  {
    query: LOCK_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        lockOnMdt: lockOnMdtSuccessResult,
      },
    }),
  },
  {
    query: UPDATE_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        updateOnMdt: updateOnMdtSuccessResult,
      },
    }),
  },
];

const errorMocks = [
  {
    query: GET_PATIENT_ON_MDT_CONNECTION_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getOnMdtConnection: getPatientOnMdtResult,
      },
    }),
  },
  {
    query: LOCK_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        lockOnMdt: lockOnMdtFailResult,
      },
    }),
  },
  {
    query: UPDATE_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        updateOnMdt: updateOnMdtErrorResult,
      },
    }),
  },
];

export default {
  title: 'Tab Pages/Patient MDT tab/Default',
  component: PatientMdtTab,
  decorators: [
    (Story) => {
      cache.reset();
      return (
        <MockAuthProvider>
          <MockPathwayProvider>
            <Story />
          </MockPathwayProvider>
        </MockAuthProvider>
      );
    },
  ],
} as ComponentMeta<typeof PatientMdtTab>;

export const Default: ComponentStory<typeof PatientMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={ successMocks }
  >
    <PatientMdtTab
      patientId="1"
    />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  getPatientMock: {
    query: GET_PATIENT_ON_MDT_CONNECTION_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getOnMdtConnection: getPatientOnMdtResult,
      },
    }),
  },
  lockOnMdt: {
    query: LOCK_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        lockOnMdt: lockOnMdtSuccessResult,
      },
    }),
  },
  updateOnMdt: {
    query: UPDATE_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        updateOnMdt: updateOnMdtErrorResult,
      },
    }),
  },
};

export const RecordLocked: ComponentStory<typeof PatientMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={ errorMocks }
  >
    <PatientMdtTab
      patientId="1"
    />
  </NewMockSdApolloProvider>
);
