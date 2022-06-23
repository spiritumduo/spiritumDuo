import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import DeleteMdtTab, { GET_MDT_QUERY, DELETE_MDT_MUTATION } from './DeleteMdtTab';
import 'react-datepicker/dist/react-datepicker.css';

const mdt = {
  id: '1',
  pathway: {
    id: '1',
    name: 'test pathway',
  },
  creator: {
    id: '1',
    username: 'test username',
    firstName: 'test',
    lastName: 'user',
  },
  createdAt: '2000-01-01T00:00:00',
  plannedAt: '2022-01-01T00:00:00',
  updatedAt: '2000-01-01T00:00:00',
  location: 'test location',
};

const successfulMutation = {
  success: true,
  userErrors: null,
};

const errorMutation = {
  success: null,
  userErrors: [{
    field: 'id',
    message: 'You cannot delete an MDT with a relation',
  }],
};

export default {
  title: 'Tab Pages/MDT Management/Delete MDT Tab',
  component: DeleteMdtTab,
  decorators: [
    (Story) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <Story />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof DeleteMdtTab>;

export const Default: ComponentStory<typeof DeleteMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: GET_MDT_QUERY,
        mockFn: () => Promise.resolve({
          data: {
            getMdt: mdt,
          },
        }),
      },
      {
        query: DELETE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            deleteMdt: successfulMutation,
          },
        }),
      }]
    }
  >
    <DeleteMdtTab />
  </NewMockSdApolloProvider>
);

export const MdtAlreadyExists: ComponentStory<typeof DeleteMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: GET_MDT_QUERY,
        mockFn: () => Promise.resolve({
          data: {
            getMdt: mdt,
          },
        }),
      },
      {
        query: DELETE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            deleteMdt: errorMutation,
          },
        }),
      }]
    }
  >
    <DeleteMdtTab />
  </NewMockSdApolloProvider>
);
