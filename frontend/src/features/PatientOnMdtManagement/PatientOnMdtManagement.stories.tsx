import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import PatientOnMdtManagement, { UPDATE_ON_MDT_MUTATION, DELETE_ON_MDT_MUTATION } from './PatientOnMdtManagement';

const onMdt = {
  id: '1',
  onMdtId: '1',
  firstName: 'Test',
  lastName: 'Patient',
  hospitalNumber: 'fMRN123456',
  nationalNumber: 'fNHS12345678',
  dateOfBirth: new Date('2000-01-01'),
  mdtReason: 'test reason',
};

const mocks = [{
  query: UPDATE_ON_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      updateOnMdt: {
        onMdt: {
          id: '1',
          onMdtId: '1',
          firstName: 'Test',
          lastName: 'Patient',
          hospitalNumber: 'fMRN123456',
          nationalNumber: 'fNHS12345678',
          dateOfBirth: new Date('2000-01-01'),
          reason: 'updated reason',
        },
        userErrors: null,
      },
    },
  }),
},
{
  query: DELETE_ON_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      deleteOnMdt: {
        success: true,
        userErrors: null,
      },
    },
  }),
}];

const errorMocks = [{
  query: UPDATE_ON_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      updateOnMdt: {
        onMdt: null,
        userErrors: [
          { field: 'test', message: 'An error has occured' },
        ],
      },
    },
  }),
},
{
  query: DELETE_ON_MDT_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      deleteOnMdt: {
        success: false,
        userErrors: [{ field: 'test', message: 'An error has occured' }],
      },
    },
  }),
}];

export default {
  title: 'Tab Pages/Patient on MDT management/Default',
  component: PatientOnMdtManagement,
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
} as ComponentMeta<typeof PatientOnMdtManagement>;

export const Default: ComponentStory<typeof PatientOnMdtManagement> = () => (
  <NewMockSdApolloProvider
    mocks={ mocks }
  >
    <PatientOnMdtManagement
      onMdt={ onMdt }
      closeCallback={ () => ({}) }
    />
  </NewMockSdApolloProvider>
);

export const ErrorStates: ComponentStory<typeof PatientOnMdtManagement> = () => (
  <NewMockSdApolloProvider
    mocks={ errorMocks }
  >
    <PatientOnMdtManagement
      onMdt={ onMdt }
      closeCallback={ () => ({}) }
    />
  </NewMockSdApolloProvider>
);

Default.parameters = {
  mocks: mocks,
};
