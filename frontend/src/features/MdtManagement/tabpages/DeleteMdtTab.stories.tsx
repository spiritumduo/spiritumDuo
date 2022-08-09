import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import DeleteMdtTab, { DELETE_MDT_MUTATION } from './DeleteMdtTab';
import 'react-datepicker/dist/react-datepicker.css';

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
    plannedAt: new Date('2025-01-01T00:00:00'),
    updatedAt: new Date('2000-01-01T00:00:00'),
    location: 'test location',
    clinicians: [],
    patients: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        hospitalNumber: 'MRN1234567',
      },
      {
        id: '2',
        firstName: 'Sammy',
        lastName: 'Seahorse',
        hospitalNumber: 'MRN7654321',
      },
    ],
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

const mdtWithPatients = {
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
  plannedAt: listOfMdts[0].plannedAt,
  updatedAt: new Date('2000-01-01T00:00:00'),
  location: 'test location',
  clinicians: [],
  patients: [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      hospitalNumber: 'MRN1234567',
    },
    {
      id: '2',
      firstName: 'Sammy',
      lastName: 'Seahorse',
      hospitalNumber: 'MRN7654321',
    },
  ],
};

const mdtWithNoPatients = {
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
  plannedAt: listOfMdts[0].plannedAt,
  updatedAt: new Date('2000-01-01T00:00:00'),
  location: 'test location',
  clinicians: [],
  patients: [],
};

const successfulMutation = {
  success: true,
  userErrors: null,
};

const errorMutation = {
  success: null,
  userErrors: [{
    field: 'id',
    message: 'An error has occured!',
  }],
};

const successfulDeleteMock = {
  query: DELETE_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      deleteMdt: successfulMutation,
    },
  }),
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

export const MdtWithNoPatients: ComponentStory<typeof DeleteMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        successfulDeleteMock,
      ]
    }
  >
    <DeleteMdtTab
      mdt={ mdtWithNoPatients }
      successCallback={ () => ({}) }
      allMdts={ listOfMdts }
    />
  </NewMockSdApolloProvider>
);

MdtWithNoPatients.parameters = {
  mdt: mdtWithNoPatients,
  successfulDeleteMock: successfulDeleteMock,
  listOfMdts: listOfMdts,
};

export const MdtWithPatients: ComponentStory<typeof DeleteMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        successfulDeleteMock,
      ]
    }
  >
    <DeleteMdtTab
      mdt={ mdtWithPatients }
      successCallback={ () => ({}) }
      allMdts={ listOfMdts }
    />
  </NewMockSdApolloProvider>
);

MdtWithPatients.parameters = {
  mdt: mdtWithPatients,
  successfulDeleteMock: successfulDeleteMock,
  listOfMdts: listOfMdts,
};

export const MdtHasUserErrors: ComponentStory<typeof DeleteMdtTab> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        {
          query: DELETE_MDT_MUTATION,
          mockFn: () => Promise.resolve({
            data: {
              deleteMdt: errorMutation,
            },
          }),
        },
      ]
    }
  >
    <DeleteMdtTab
      mdt={ mdtWithNoPatients }
      successCallback={ () => ({}) }
      allMdts={ listOfMdts }
    />
  </NewMockSdApolloProvider>
);
