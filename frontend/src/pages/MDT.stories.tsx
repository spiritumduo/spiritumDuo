import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { reorderOnMdt, reorderOnMdtVariables } from 'features/MDTList/components/PatientList/__generated__/reorderOnMdt';
import { Default as MdtListStory } from 'features/MDTList/MDTList.stories';

import MDTPage from './MDT';

const itemsPerPage = 9;

// Dummy data for display
const onMdtEdges: {
    cursor: string;
    node: {
      id: string;
      reason: string;
      order: number;
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
      order: i - 1,
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
        ...MdtListStory.parameters?.mocks,
      ]
    }
  >
    <MDTPage />
  </NewMockSdApolloProvider>
);
