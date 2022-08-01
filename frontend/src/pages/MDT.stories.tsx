import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { Default as DefaultPatientOnMdtManagement } from 'features/PatientOnMdtManagement/PatientOnMdtManagement.stories';
import MDTPage, { GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY, LOCK_ON_MDT_MUTATION, REORDER_ON_MDT_MUTATION } from './MDT';
import { reorderOnMdt, reorderOnMdtVariables } from './__generated__/reorderOnMdt';

const itemsPerPage = 9;

// Dummy data for display
const onMdtEdges: {
    cursor: string;
    node: {
      id: string;
      reason: string;
      patient: {
        id: string;
        firstName: string;
        lastName: string;
        hospitalNumber: string;
        nationalNumber: string;
        dateOfBirth: Date;
    };
  }
}[] = [];

for (let i = 1; i < itemsPerPage + 1; ++i) {
  onMdtEdges.push({
    cursor: i.toString(),
    node: {
      id: i.toString(),
      reason: `reason goes here (${i})`,
      patient: {
        id: i.toString(),
        firstName: 'First',
        lastName: `Last (${i})`,
        hospitalNumber: `fMRN000000${i}`,
        nationalNumber: `fNHS000000${i}`,
        dateOfBirth: new Date(`2000-01-0${i}`),
      },
    },
  });
}

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

const reorderOnMdtResult = async (
  { input: { onMdtList } }: reorderOnMdtVariables,
): Promise<reorderOnMdt> => ({
  updateOnMdtList: {
    __typename: 'OnMdtListPayload',
    onMdtList: onMdtList?.flatMap(
      (item) => {
        if (!item.order) return [];
        return {
          __typename: 'OnMdt',
          id: item.id,
          order: item.order
        };
      },
    ) || null,
  },
});

export default {
  title: 'Pages/MDT page',
  component: MDTPage,
  decorators: [
    (Story) => (
      <MockPathwayProvider>
        <MemoryRouter initialEntries={ ['/mdt/1'] }>
          <Routes>
            <Route path="/mdt/:mdtId" element={ <Story /> } />
          </Routes>
        </MemoryRouter>
      </MockPathwayProvider>
    ),
  ],
} as ComponentMeta<typeof MDTPage>;

export const Default: ComponentStory<typeof MDTPage> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: REORDER_ON_MDT_MUTATION,
          mockFn: reorderOnMdtResult,
        },
        {
          query: GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY,
          mockFn: () => Promise.resolve({
            data: {
              getOnMdtConnection: {
                totalCount: itemsPerPage,
                edges: onMdtEdges,
                pageInfo: {
                  hasNextPage: false,
                  endCursor: itemsPerPage,
                },
              },
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
        ...DefaultPatientOnMdtManagement.parameters?.mocks,
      ]
    }
  >
    <MDTPage />
  </NewMockSdApolloProvider>
);

export const Locked: ComponentStory<typeof MDTPage> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: REORDER_ON_MDT_MUTATION,
          mockFn: reorderOnMdtResult,
        },
        {
          query: GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY,
          mockFn: () => Promise.resolve({
            data: {
              getOnMdtConnection: {
                totalCount: itemsPerPage,
                edges: onMdtEdges,
                pageInfo: {
                  hasNextPage: false,
                  endCursor: itemsPerPage,
                },
              },
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
        ...DefaultPatientOnMdtManagement.parameters?.mocks,
      ]
    }
  >
    <MDTPage />
  </NewMockSdApolloProvider>
);
