import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import MDT from 'types/MDT';

import { Default as PatientListStory } from './components/PatientList/MDTPatientList.stories';
import { Default as MdtManagementModalStory } from './components/MdtManagement/MdtManagementModal.stories';
import { Default as CreateMdtModalStory } from './components/CreateMdtModal/CreateMdtModal.stories';
import MDTList, { GET_MDT_CONNECTION_QUERY } from './MDTList';

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
    {
      id: '1',
      firstName: 'John1',
      lastName: 'Doe1',
      hospitalNumber: 'MRN1234561',
    },
    {
      id: '2',
      firstName: 'John2',
      lastName: 'Doe2',
      hospitalNumber: 'MRN1234562',
    },
    {
      id: '3',
      firstName: 'John3',
      lastName: 'Doe3',
      hospitalNumber: 'MRN1234563',
    },
    {
      id: '4',
      firstName: 'John4',
      lastName: 'Doe4',
      hospitalNumber: 'MRN1234564',
    },
  ],
  clinicians: [
    {
      id: '1',
      firstName: 'John1',
      lastName: 'Doe1',
      username: 'JOHN.DOE1',
    },
    {
      id: '2',
      firstName: 'John2',
      lastName: 'Doe2',
      username: 'JOHN.DOE2',
    },
    {
      id: '3',
      firstName: 'John3',
      lastName: 'Doe3',
      username: 'JOHN.DOE3',
    },
    {
      id: '4',
      firstName: 'John4',
      lastName: 'Doe4',
      username: 'JOHN.DOE4',
    },
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
      plannedAt: new Date(new Date(mdt.plannedAt).setDate(mdt.plannedAt.getDate() + i)),
      updatedAt: mdt.updatedAt,
      location: `${mdt.location} (${i})`,
    },
  };
  mdtEdges.push(newEdge);
}

export default {
  title: 'Features/MDT list/Default',
  component: MDTList,
  decorators: [
    (Story) => (
      <MockPathwayProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </MockPathwayProvider>
    ),
  ],
} as ComponentMeta<typeof MDTList>;

const getMdtConnectionMock = {
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
};

export const Default: ComponentStory<typeof MDTList> = () => {
  const [selectedMdt, setSelectedMdt] = useState<MDT | null>(null);
  return (
    <MockAuthProvider>
      <MockPathwayProvider>
        <NewMockSdApolloProvider
          mocks={
            [
              ...MdtManagementModalStory.parameters?.mocks,
              ...PatientListStory.parameters?.mocks,
              ...CreateMdtModalStory.parameters?.mocks,
              getMdtConnectionMock,
            ]
          }
        >
          <MDTList
            pathwayId="1"
            selectedMdt={ selectedMdt }
            setSelectedMdt={ setSelectedMdt }
          />
        </NewMockSdApolloProvider>
      </MockPathwayProvider>
    </MockAuthProvider>
  );
};

Default.parameters = {
  mocks: [
    ...MdtManagementModalStory.parameters?.mocks,
    ...PatientListStory.parameters?.mocks,
    ...CreateMdtModalStory.parameters?.mocks,
    getMdtConnectionMock,
  ],
};
