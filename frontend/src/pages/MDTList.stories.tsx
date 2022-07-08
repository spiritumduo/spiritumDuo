import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockPathwayProvider } from 'test/mocks/mockContext';

import { Default as MdtManagementStory } from 'features/MdtManagement/MdtManagement.stories'
import { Default as CreateMdtTabStory } from 'features/MdtManagement/CreateMdtModal/CreateMdtModal.stories'
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import MDTListPage, { GET_MDT_CONNECTION_QUERY } from './MDTList';

const itemsPerPage = 10;

// Dummy data for display
const mdtEdges: {
    cursor: string;
    node: {
      id: string;
      patients: {id: string;}[];
      clinicians: {id: string;}[];
      createdAt: Date;
      plannedAt: Date;
      updatedAt: Date;
      location: string;
    }
}[] = [];

const mdt = {
  patients: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ],
  clinicians: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ],
  createdAt: new Date('2025-01-01'),
  plannedAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  location: 'test location',
};

for (let i = 1; i < itemsPerPage; ++i) {
  const newEdge = {
    cursor: i.toString(),
    node: {
      id: i.toString(),
      patients: mdt.patients,
      clinicians: mdt.clinicians,
      createdAt: mdt.createdAt,
      plannedAt: mdt.plannedAt,
      updatedAt: mdt.updatedAt,
      location: `${mdt.location} (${i})`,
    },
  };
  mdtEdges.push(newEdge);
}

export default {
  title: 'Pages/MDT list page',
  component: MDTListPage,
  decorators: [
    (Story) => (
      <MockPathwayProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </MockPathwayProvider>
    ),
  ],
} as ComponentMeta<typeof MDTListPage>;

export const Default: ComponentStory<typeof MDTListPage> = () => (
  <MockPathwayProvider>
    <NewMockSdApolloProvider
      mocks={
        [
          ...MdtManagementStory?.parameters?.mocks,
          ...CreateMdtTabStory?.parameters?.mocks,
          {
            query: GET_MDT_CONNECTION_QUERY,
            mockFn: () => Promise.resolve({
              data: {
                getMdtConnection: {
                  totalCount: itemsPerPage,
                  edges: mdtEdges,
                  pageInfo: {
                    hasNextPage: false,
                    endCursor: itemsPerPage,
                  },
                },
              },
            }),
          },
        ]
      }
    >
      <MDTListPage />
    </NewMockSdApolloProvider>
  </MockPathwayProvider>
);
