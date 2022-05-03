/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { CREATE_PATHWAY_MUTATION } from 'components/CreatePathwayTab';
import { UPDATE_PATHWAY_MUTATION } from 'components/UpdatePathwayTab';
import { DELETE_PATHWAY_MUTATION } from 'components/DeletePathwayTab';
import PathwayManagementTabSet, { GET_MILESTONE_TYPES, GET_PATHWAYS } from './PathwayManagement';

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
    name: 'Test pathway 1',
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

const successfulPathwayDeleteResult = {
  success: true,
  userErrors: null,
};

export default {
  title: 'Tab Pages/Pathway Management',
  component: PathwayManagementTabSet,
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
} as ComponentMeta<typeof PathwayManagementTabSet>;

export const Default: ComponentStory<typeof PathwayManagementTabSet> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: GET_MILESTONE_TYPES,
          mockFn: () => Promise.resolve({
            data: {
              getMilestoneTypes: milestoneTypes,
            },
          }),
        },
        {
          query: GET_PATHWAYS,
          mockFn: () => Promise.resolve({
            data: {
              getPathways: pathways,
            },
          }),
        },
        {
          query: CREATE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              createPathway: successfulPathwayCreationResult,
            },
          }),
        },
        {
          query: UPDATE_PATHWAY_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              updatePathway: successfulPathwayUpdateResult,
            },
          }),
        },
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
    <PathwayManagementTabSet />
  </NewMockSdApolloProvider>
);
