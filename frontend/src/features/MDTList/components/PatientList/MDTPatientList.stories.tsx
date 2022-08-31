import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import { Default as PatientPathwayDefault } from 'features/PatientPathway/PatientPathway.stories';
import { Default as PreviousDecisionPointsStory } from 'pages/PreviousDecisionPoints.stories';
import { Default as DecisionPointsStory } from 'features/DecisionPoint/DecisionPoint.stories';
import { Default as MdtTabStory } from 'features/PatientMdtTab/PatientMdtTab.stories'
import { Default as ModalPatientStory } from 'components/ModalPatient.stories';

import { GET_PATIENT_CURRENT_PATHWAY_QUERY } from 'components/ModalPatient';
import MockConfigProvider from 'test/mocks/mockConfig';
import { LOCK_ON_MDT_MUTATION as LOCK_ON_MDT_MUTATION_MANAGEMENT } from './MDTPatientList';
import MDTPatientList, { GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY, REORDER_ON_MDT_MUTATION } from './MDTPatientList';
import { Default as OnMdtManagementStory } from '../OnMdtManagement/OnMdtManagement.stories';

const itemsPerPage = 5;

const onMdtEdges: {
  cursor: string;
  node: {
    id: string;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      hospitalNumber: string;
      nationalNumber: string;
      dateOfBirth: Date;
    };
    reason: string;
    order: string;
  }
}[] = [];

const onMdt = {
  id: '1',
  reason: 'insert reason here',
  order: '1',
  patient: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    hospitalNumber: 'fMRN123456',
    nationalNumber: 'fNHS1234567',
  },
};

const patient = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  hospitalNumber: 'fMRN123456',
  dateOfBirth: new Date('2000-01-01'),
  sex: 'MALE',
  nationalNumber: 'fNHS12345678',
};

for (let i = 1; i < itemsPerPage; ++i) {
  const newEdge = {
    cursor: i.toString(),
    node: {
      id: i.toString(),
      patient: {
        id: i.toString(),
        firstName: `${onMdt.patient.firstName}-${i}`,
        lastName: `${onMdt.patient.lastName}-${i}`,
        hospitalNumber: `${onMdt.patient.hospitalNumber}${i}`,
        nationalNumber: `${onMdt.patient.nationalNumber}${i}`,
        dateOfBirth: new Date(`199${i}-01-01`),
      },
      reason: `test reason ${i.toString()}`,
      order: i.toString(),
    },
  };
  onMdtEdges.push(newEdge);
}

const mocks = [
  ...PatientPathwayDefault.parameters?.mocks,
  DecisionPointsStory.parameters?.createDecisionMock,
  DecisionPointsStory.parameters?.getPatientMock,
  DecisionPointsStory.parameters?.getMdtsMock,
  PreviousDecisionPointsStory.parameters?.getPatientMock,
  MdtTabStory.parameters?.getPatientMock,
  MdtTabStory.parameters?.lockOnMdt,
  MdtTabStory.parameters?.updateOnMdt,
  ModalPatientStory.parameters?.userHasLockMocks,
  ...OnMdtManagementStory.parameters?.mocks,
  {
    query: GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getOnMdtConnection: {
          totalCount: itemsPerPage,
          edges: onMdtEdges,
          pageInfo: {
            hasNextPage: false,
            endCursor: itemsPerPage,
          },
        },
      },
    }),
  },
  {
    query: GET_PATIENT_CURRENT_PATHWAY_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getPatient: {
          ...patient,
          onPathways: [{
            id: '1',
          }],
        },
      },
    }),
  },
  {
    query: LOCK_ON_MDT_MUTATION_MANAGEMENT,
    mockFn: () => Promise.resolve({
      data: {
        lockOnMdt: {
          onMdt: {
            id: '1',
            lockEndTime: new Date('2050-01-01'),
            lockUser: {
              id: '1',
              username: 'test',
              firstName: 'test',
              lastName: 'user',
            },
          },
          userErrors: null,
        },
      },
    }),
  },
  {
    query: REORDER_ON_MDT_MUTATION,
    mockFn: () => Promise.resolve({
      data: {
        onMdtList: {
          id: '1',
          order: '1',
        },
      },
    }),
  },
];

export default {
  title: 'Features/MDT list/MDT Patient List',
  component: MDTPatientList,
  decorators: [
    (Story) => (
      <MockPathwayProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </MockPathwayProvider>
    ),
  ],
} as ComponentMeta<typeof MDTPatientList>;

export const Default: ComponentStory<typeof MDTPatientList> = () => (
  <MockConfigProvider>
    <MockAuthProvider>
      <NewMockSdApolloProvider
        mocks={ mocks }
      >
        <MDTPatientList
          mdtId="1"
        />
      </NewMockSdApolloProvider>
    </MockAuthProvider>
  </MockConfigProvider>
);

Default.parameters = {
  mocks: mocks,
};
