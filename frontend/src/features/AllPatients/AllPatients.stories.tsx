/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useAppDispatch } from 'app/hooks';
import searchBarReducer, { setQuery } from 'features/SearchBar/SearchBar.slice';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from 'components/WrappedPatientList';
import Patient from 'types/Patient';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import AllPatients, { PATIENT_SEARCH_QUERY } from './AllPatients';

// Dummy data for display
const patientArray: Patient[] = [];
const patient = {
  hospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
};

const milestones = [
  {
    id: '1',
    updatedAt: new Date(2021, 1, 5),
    currentState: 'COMPLETED',
    milestoneType: {
      name: 'Triage',
    },
  },
  {
    id: '2',
    updatedAt: new Date(2020, 1, 5),
    currentState: 'INIT',
    milestoneType: {
      name: 'Second',
    },
  },
  {
    id: '3',
    updatedAt: new Date(2022, 1, 5),
    currentState: 'COMPLETED',
    milestoneType: {
      name: 'Third Milestone',
    },
  },
];

for (let i = 0; i < 15; ++i) {
  let lockUser = null;
  let lockEndTime = null;
  if (i === 0) {
    lockUser = {
      id: 1000,
      firstName: 'Johnny',
      lastName: 'Locker',
      userName: 'JLocker',
    };
    lockEndTime = new Date(2030, 1, 1, 12, 0, 0);
  } else if (i === 1) {
    lockUser = {
      id: 1,
      firstName: 'Test-John',
      lastName: 'Test-Doe',
      userName: 'jdoe',
    };
    lockEndTime = new Date(2030, 1, 1, 12, 0, 0);
  }
  const newPatient = {
    id: i.toString(),
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: `${patient.firstName} ${i + 1}`,
    lastName: `${patient.lastName} ${i + 1}`,
    dateOfBirth: new Date('1970-01-01'),
    onPathways: [
      {
        id: i.toString(),
        decisionPoints: [
          {
            milestones: milestones,
          },
        ],
        updatedAt: new Date(2021, 1, 10),
        lockEndTime: lockEndTime,
        lockUser: lockUser,
      },
    ],
  };
  patientArray.push(newPatient);
}

const edges = patientArray.map((p) => ({
  cursor: `${p.id}YXJyYXljb25uZWN0aW9uOjA=`,
  node: p,
}));

export default {
  title: 'Features/AllPatients',
  component: AllPatients,
} as ComponentMeta<typeof AllPatients>;

const Template: ComponentStory<typeof AllPatients> = (args) => <AllPatients { ...args } />;

const patientsPerPage = 10;
export const Default = Template.bind({});
Default.args = {
  pathwayId: '1',
  patientsPerPage: patientsPerPage,
};
Default.parameters = {
  patients: patientArray,
  edges: edges,
  apolloClient: {
    mocks: [
      { // PAGE 1
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            after: undefined,
            outstanding: false,
            underCareOf: false,
            includeDischarged: true,
          },
        },
        result: {
          data: {
            getPatientOnPathwayConnection: {
              totalCount: edges.length,
              edges: edges.slice(0, patientsPerPage),
              pageInfo: {
                hasNextPage: true,
                endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              },
            },
          },
        },
      },
      { // PAGE 2
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            after: 'YXJyYXljb25uZWN0aW9uOjA=',
            outstanding: false,
            underCareOf: true,
            includeDischarged: true,
          },
        },
        result: {
          data: {
            getPatientOnPathwayConnection: {
              totalCount: edges.length,
              edges: edges.slice(patientsPerPage, patientsPerPage + patientsPerPage),
              pageInfo: {
                hasNextPage: false,
                endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              },
            },
          },
        },
      },
    ],
  },
};

const SearchMock = () => {
  const dispatch = useAppDispatch();
  dispatch(setQuery('Test'));
  return <></>;
};

export const Search = Template.bind({});
Search.args = {
  pathwayId: '1',
  patientsPerPage: 10,
};
const apolloMocks = [{
  query: PATIENT_SEARCH_QUERY,
  variables: { query: 'Test', pathwayId: '1 ' },
  mockFn: () => Promise.resolve({
    data: {
      patientSearch: [
        {
          id: '1',
          firstName: 'Test',
          lastName: 'Test',
          hospitalNumber: 'fMRN1234567',
          nationalNumber: 'fNHS1234567890',
          dateOfBirth: new Date(),
          onPathways: [{
            outstandingMilestone: [{
              id: '1',
              updatedAt: new Date(),
              milestoneType: {
                name: 'Test request',
              },
            }],
            milestone: [{
              id: '1',
              updatedAt: new Date(),
              milestoneType: {
                name: 'Test request',
              },
            }],
            lockUser: {
              id: '1',
              firstName: 'Test',
              lastName: 'User',
            },
            lockEndTime: new Date(),
          }],
        },
      ],
    },
  }),
}];
Search.decorators = [
  (Story) => {
    const store = configureStore({
      reducer: { searchBar: searchBarReducer },
    });

    return (
      <NewMockSdApolloProvider mocks={ apolloMocks }>
        <MockPathwayProvider>
          <Provider store={ store }>
            <SearchMock />
            <Story />
          </Provider>
        </MockPathwayProvider>
      </NewMockSdApolloProvider>
    );
  },
];