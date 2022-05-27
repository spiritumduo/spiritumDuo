/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import DeletePathwayTab, { DELETE_PATHWAY_MUTATION } from './DeletePathwayTab';

const milestoneTypes = [
  {
    id: '1',
    name: 'TEST_MILESTONE_TYPE_ONE',
    refName: 'ref_TEST_MILESTONE_TYPE_ONE',
  },
  {
    id: '2',
    name: 'TEST_MILESTONE_TYPE_TWO',
    refName: 'ref_TEST_MILESTONE_TYPE_TWO',
  },
];

const pathways = [
  {
    id: '1',
    name: 'pathway one',
    milestoneTypes: [
      {
        id: '1',
        name: 'TEST_MILESTONE_TYPE_ONE',
        refName: 'ref_TEST_MILESTONE_TYPE_ONE',
      },
    ],
  },
];

const successfulPathwayDeleteResult = {
  success: true,
  userErrors: null,
};

const errorPathwayDeleteResult = {
  success: null,
  userErrors: [{
    field: 'name',
    message: 'pathway has constraints',
  }],
};

export default {
  title: 'Tab Pages/Pathway Management/Delete Pathway Tab',
  component: DeletePathwayTab,
  decorators: [
    (DeletePathwayTabStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <DeletePathwayTabStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof DeletePathwayTab>;

export const Default: ComponentStory<typeof DeletePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: DELETE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              deletePathway: successfulPathwayDeleteResult,
            },
          }),
        },
      ]
    }
  >
    <DeletePathwayTab
      pathways={ pathways }
      milestoneTypes={ milestoneTypes }
    />
  </NewMockSdApolloProvider>
);

export const PathwayHasConstraints: ComponentStory<typeof DeletePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: DELETE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              deletePathway: errorPathwayDeleteResult,
            },
          }),
        },
      ]
    }
  >
    <DeletePathwayTab
      pathways={ pathways }
      milestoneTypes={ milestoneTypes }
    />
  </NewMockSdApolloProvider>
);
