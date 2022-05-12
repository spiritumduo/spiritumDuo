/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import UpdatePathwayTab, { UPDATE_PATHWAY_MUTATION } from './UpdatePathwayTab';

const milestoneTypes = [
  {
    id: '1',
    name: 'Test milestone type 1',
    refName: 'ref test milestone type 1',
  },
  {
    id: '2',
    name: 'Test milestone type 2',
    refName: 'ref test milestone type 2',
  },
];

const pathways = [
  {
    id: '1',
    name: 'pathway one',
    milestoneTypes: [
      {
        id: '1',
        name: 'Test milestone type 1',
        refName: 'ref test milestone type 1',
      },
    ],
  },
];

const successfulPathwayUpdateResult = {
  pathway: {
    id: '1',
    name: 'pathway one edited',
    milestoneTypes: [
      {
        id: '1',
        name: 'Test milestone type 1',
        refName: 'ref test milestone type 1',
      },
      {
        id: '2',
        name: 'Test milestone type 2',
        refName: 'ref test milestone type 2',
      },
    ],
  },
  userErrors: null,
};

const errorPathwayUpdateResult = {
  pathway: null,
  userErrors: [{
    field: 'name',
    message: 'a pathway with that name already exists',
  }],
};

export default {
  title: 'Tab Pages/Pathway Management/Update Pathway Tab',
  component: UpdatePathwayTab,
  decorators: [
    (UpdatePathwayTabStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <UpdatePathwayTabStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof UpdatePathwayTab>;

export const Default: ComponentStory<typeof UpdatePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: UPDATE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              updatePathway: successfulPathwayUpdateResult,
            },
          }),
        },
      ]
    }
  >
    <UpdatePathwayTab
      milestoneTypes={ milestoneTypes }
      pathways={ pathways }
    />
  </NewMockSdApolloProvider>
);

export const PathwayExistsError: ComponentStory<typeof UpdatePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: UPDATE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              updatePathway: errorPathwayUpdateResult,
            },
          }),
        },
      ]
    }
  >
    <UpdatePathwayTab
      milestoneTypes={ milestoneTypes }
      pathways={ pathways }
    />
  </NewMockSdApolloProvider>
);
