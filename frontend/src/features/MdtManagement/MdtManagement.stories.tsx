import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import MdtManagement, { GET_MDTS_QUERY } from './MdtManagement';
import { UPDATE_MDT_MUTATION, GET_USERS } from './tabpages/UpdateMdtTab';
import 'react-datepicker/dist/react-datepicker.css';
import { DELETE_MDT_MUTATION } from './tabpages/DeleteMdtTab';

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
    createdAt: '2000-01-01T00:00:00',
    plannedAt: '2022-01-01T00:00:00',
    updatedAt: '2000-01-01T00:00:00',
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
    createdAt: '3000-01-01T00:00:00',
    plannedAt: '3000-01-01T00:00:00',
    updatedAt: '3000-01-01T00:00:00',
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
    mocks={ mocks }
  >
    <MdtManagement
      showModal
      setShowModal={ () => ({}) }
      mdtId="1"
    />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  mocks: mocks,
};
