/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import CreatePathwayTab, { CREATE_PATHWAY_MUTATION } from './CreatePathwayTab';

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

const successfulPathwayCreationResult = {
  pathway: {
    id: '1',
    name: 'test pathway',
    milestoneTypes: [
      {
        id: '1',
        name: 'test milestone one',
        refName: 'ref test milestone one',
      },
      {
        id: '2',
        name: 'test milestone two',
        refName: 'ref test milestone two',
      },
    ],
  },
  userErrors: null,
};

const errorPathwayCreationResult = {
  pathway: null,
  userErrors: [{
    field: 'name',
    message: 'a pathway with that name already exists',
  }],
};

export default {
  title: 'Tab Pages/Pathway Management/Create Pathway Tab',
  component: CreatePathwayTab,
  decorators: [
    (CreatePathwayTabStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <CreatePathwayTabStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof CreatePathwayTab>;

export const Default: ComponentStory<typeof CreatePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: CREATE_PATHWAY_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            createPathway: successfulPathwayCreationResult,
          },
        }),
      }]
    }
  >
    <CreatePathwayTab
      disableForm={ false }
      milestoneTypes={ milestoneTypes }
    />
  </NewMockSdApolloProvider>
);

export const PathwayExistsError: ComponentStory<typeof CreatePathwayTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: CREATE_PATHWAY_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            createPathway: errorPathwayCreationResult,
          },
        }),
      }]
    }
  >
    <CreatePathwayTab
      milestoneTypes={ milestoneTypes }
    />
  </NewMockSdApolloProvider>
);
