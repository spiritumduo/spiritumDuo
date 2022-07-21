import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import UpdateMdtTab, { UPDATE_MDT_MUTATION, GET_USERS } from './UpdateMdtTab';
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
  createdAt: new Date('2000-01-01T00:00:00'),
  plannedAt: new Date('2022-01-01T00:00:00'),
  updatedAt: new Date('2000-01-01T00:00:00'),
  location: 'test location',
  clinicians: [{
    id: '1',
    firstName: 'Test',
    lastName: 'Dummy',
    username: 'tdummy',
  }],
};

const successfulMutation = {
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

const errorMutation = {
  mdt: null,
  userErrors: [{
    field: 'name',
    message: 'an mdt on that date already exists',
  }],
};

const successfulUpdateMock = {
  query: UPDATE_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      updateMdt: successfulMutation,
    },
  }),
};

const getUsersMock = {
  query: GET_USERS,
  mockFn: () => Promise.resolve({
    data: {
      getUsers: [{
        id: '1',
        firstName: 'Test',
        lastName: 'Dummy',
        username: 'tdummy',
      }],
    },
  }),
};

export default {
  title: 'Tab Pages/MDT Management/Update MDT Tab',
  component: UpdateMdtTab,
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
} as ComponentMeta<typeof UpdateMdtTab>;

export const Default: ComponentStory<typeof UpdateMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [successfulUpdateMock, getUsersMock]
    }
  >
    <UpdateMdtTab mdt={ mdt } successCallback={ () => ({}) } />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  mocks: [successfulUpdateMock, getUsersMock],
};

export const MdtAlreadyExists: ComponentStory<typeof UpdateMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: UPDATE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            updateMdt: errorMutation,
          },
        }),
      }, {
        query: GET_USERS,
        mockFn: () => Promise.resolve({
          data: {
            getUsers: [{
              id: '1',
              firstName: 'Test',
              lastName: 'Dummy',
              username: 'tdummy',
            }],
          },
        }),
      }]
    }
  >
    <UpdateMdtTab mdt={ mdt } successCallback={ () => ({}) } />
  </NewMockSdApolloProvider>
);
