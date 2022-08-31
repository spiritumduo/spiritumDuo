import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import MDTManagementModal, { GET_MDTS_QUERY } from './MdtManagementModal';
import { UPDATE_MDT_MUTATION, GET_USERS } from '../UpdateMdtForm/UpdateMdtForm';
import 'react-datepicker/dist/react-datepicker.css';
import { DELETE_MDT_MUTATION } from '../DeleteMdtForm/DeleteMdtForm';

const listOfMdts = [
  {
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
    patients: [],
  },
  {
    id: '2',
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
    plannedAt: new Date('2025-02-01T00:00:00'),
    updatedAt: new Date('2000-01-01T00:00:00'),
    location: 'test location',
    clinicians: [],
    patients: [
      {
        id: '3',
        firstName: 'Jane',
        lastName: 'Doe',
        hospitalNumber: 'MRN1111111',
      },
    ],
  },
  {
    id: '3',
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
    plannedAt: new Date('2025-04-01T00:00:00'),
    updatedAt: new Date('2000-01-01T00:00:00'),
    location: 'test location',
    clinicians: [],
    patients: [
      {
        id: '4',
        firstName: 'Janet',
        lastName: 'Doe',
        hospitalNumber: 'MRN2222222',
      },
    ],
  },
];

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
    createdAt: new Date('3000-01-01T00:00:00'),
    plannedAt: new Date('3000-01-01T00:00:00'),
    updatedAt: new Date('3000-01-01T00:00:00'),
    location: 'test location',
    clinicians: [],
  },
  userErrors: null,
};

const successfulDeleteMutation = {
  success: true,
  userErrors: null,
};

const mocks = [
  {
    query: GET_MDTS_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getMdts: listOfMdts,
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
    query: DELETE_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        deleteMdt: successfulDeleteMutation,
      },
    }),
  },
  {
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
  },
];

const mdt = {
  id: '1000',
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
  patients: [],
};

export default {
  title: 'Tab Pages/MDT Management/Default',
  component: MDTManagementModal,
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
} as ComponentMeta<typeof MDTManagementModal>;

export const Default: ComponentStory<typeof MDTManagementModal> = () => (
  <NewMockSdApolloProvider
    mocks={ mocks }
  >
    <MDTManagementModal
      mdt={ mdt }
      closeCallback={ () => ({}) }
    />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  mocks: mocks,
};
