import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import MdtManagement from './MdtManagement';
import { CREATE_MDT_MUTATION } from './tabpages/CreateMdtTab';
import { GET_MDT_QUERY, UPDATE_MDT_MUTATION } from './tabpages/UpdateMdtTab';
import 'react-datepicker/dist/react-datepicker.css';
import { GET_MDT_QUERY as GET_MDT_QUERY_DELETE, DELETE_MDT_MUTATION } from './tabpages/DeleteMdtTab';

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

const successfulCreateMutation = {
  mdt: {
    id: '1',
    pathway: {
      id: '1',
      name: 'test pathway',
    },
    creator: {
      id: '1',
      username: 'test username',
    },
    createdAt: '3000-01-01T00:00:00',
    plannedAt: '3000-01-01T00:00:00',
    updatedAt: '3000-01-01T00:00:00',
    location: 'new test location',
  },
  userErrors: null,
};

const successfulUpdateMutation = {
  mdt: {
    id: '1',
    pathway: {
      id: '1',
      name: 'test pathway',
    },
    creator: {
      id: '1',
      username: 'test username',
    },
    createdAt: '3000-01-01T00:00:00',
    plannedAt: '3000-01-01T00:00:00',
    updatedAt: '3000-01-01T00:00:00',
    location: 'test location',
  },
  userErrors: null,
};

const successfulDeleteMutation = {
  success: true,
  userErrors: null,
};

export default {
  title: 'Tab Pages/MDT Management/Default',
  component: MdtManagement,
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
} as ComponentMeta<typeof MdtManagement>;

export const Default: ComponentStory<typeof MdtManagement> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: CREATE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            createMdt: successfulCreateMutation,
          },
        }),
      },
      {
        query: GET_MDT_QUERY,
        mockFn: () => Promise.resolve({
          data: {
            getMdt: mdt,
          },
        }),
      },
      {
        query: UPDATE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            updateMdt: successfulUpdateMutation,
          },
        }),
      },
      {
        query: GET_MDT_QUERY_DELETE,
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
            deleteMdt: successfulDeleteMutation,
          },
        }),
      }]
    }
  >
    <MdtManagement
      showModal
      setShowModal={ () => ({}) }
    />
  </NewMockSdApolloProvider>
);
