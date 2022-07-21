/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { CREATE_PATHWAY_MUTATION } from './tabpages/CreatePathwayTab';
import { UPDATE_PATHWAY_MUTATION } from './tabpages/UpdatePathwayTab';
import { DELETE_PATHWAY_MUTATION } from './tabpages/DeletePathwayTab';
import PathwayManagementTabSet, { GET_CLINICALREQUEST_TYPES, GET_PATHWAYS } from './PathwayManagement';

const clinicalRequestTypes = [
  {
    id: '1',
    name: 'Test clinicalRequest type 1',
    refName: 'ref test clinicalRequest type 1',
  },
  {
    id: '2',
    name: 'Test clinicalRequest type 2',
    refName: 'ref test clinicalRequest type 2',
  },
];

const pathways = [
  {
    id: '1',
    name: 'Test pathway 1',
    clinicalRequestTypes: [
      {
        id: '1',
        name: 'Test clinicalRequest type 1',
        refName: 'ref test clinicalRequest type 1',
      },
      {
        id: '2',
        name: 'Test clinicalRequest type 2',
        refName: 'ref test clinicalRequest type 2',
      },
    ],
  },
];

const successfulPathwayCreationResult = {
  pathway: {
    id: '1',
    name: 'test pathway',
    clinicalRequestTypes: [
      {
        id: '1',
        name: 'test clinicalRequest one',
        refName: 'ref test clinicalRequest one',
      },
      {
        id: '2',
        name: 'test clinicalRequest two',
        refName: 'ref test clinicalRequest two',
      },
    ],
  },
  userErrors: null,
};

const successfulPathwayUpdateResult = {
  pathway: {
    id: '1',
    name: 'pathway one edited',
    clinicalRequestTypes: [
      {
        id: '1',
        name: 'Test clinicalRequest type 1',
        refName: 'ref test clinicalRequest type 1',
      },
      {
        id: '2',
        name: 'Test clinicalRequest type 2',
        refName: 'ref test clinicalRequest type 2',
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
          query: GET_CLINICALREQUEST_TYPES,
          mockFn: () => Promise.resolve({
            data: {
              getClinicalRequestTypes: clinicalRequestTypes,
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
