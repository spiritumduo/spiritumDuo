import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import CreateMdtModal, { CREATE_MDT_MUTATION } from './CreateMdtModal';
import 'react-datepicker/dist/react-datepicker.css';

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
    location: 'test location',
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

export default {
  title: 'Tab Pages/MDT Management/Create MDT Tab',
  component: CreateMdtModal,
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
} as ComponentMeta<typeof CreateMdtModal>;

export const Default: ComponentStory<typeof CreateMdtModal> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: CREATE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            createMdt: successfulMutation,
          },
        }),
      }]
    }
  >
    <CreateMdtModal
      setShowModal={ () => ({}) }
      showModal
    />
  </NewMockSdApolloProvider>
);

export const MdtAlreadyExists: ComponentStory<typeof CreateMdtModal> = () => (
  <NewMockSdApolloProvider
    mocks={
      [{
        query: CREATE_MDT_MUTATION,
        mockFn: () => Promise.resolve({
          data: {
            createMdt: errorMutation,
          },
        }),
      }]
    }
  >
    <CreateMdtModal
      setShowModal={ () => ({}) }
      showModal
    />
  </NewMockSdApolloProvider>
);
