/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import WrappedPatientList, { GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY } from 'components/WrappedPatientList';
import Patient from 'types/Patient';
import { MemoryRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';
import { Standard } from 'components/Notification.stories';

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

for (let i = 0; i < 20; ++i) {
  const newPatient = {
    id: i,
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: `${patient.firstName} ${i + 1}`,
    lastName: `${patient.lastName} ${i + 1}`,
    dateOfBirth: new Date('1970-01-01'),
    onPathways: [
      {
        decisionPoints: [
          {
            milestones: milestones,
          },
        ],
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
  title: 'Components/WrappedPatientList',
  component: WrappedPatientList,
  decorators: [
    (WrappedPatientListStory) => (
      <MemoryRouter>
        <WrappedPatientListStory />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof WrappedPatientList>;

const Template: ComponentStory<typeof WrappedPatientList> = (
  args,
) => <WrappedPatientList { ...args } />;

const patientsPerPage = 10;

// eslint-disable-next-line camelcase
type QueryPatient = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;
const linkFactory = (
  linkPatient: QueryPatient,
) => <Link to="/wrappedPatientListExample">{ `${linkPatient.firstName} ${linkPatient.lastName}` }</Link>;

export const Default = Template.bind({});
Default.args = {
  pathwayId: '1',
  patientsToDisplay: 10,
  outstanding: false,
  linkFactory: linkFactory,
  underCareOf: true,
  includeDischarged: true,
};
Default.parameters = {
  patients: patientArray,
  edges: edges,
  apolloClient: {
    mocks: [
      Standard.parameters?.apolloClient.mocks[0], // notification mock
      { // PAGE 1
        request: {
          query: GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
          variables: {
            pathwayId: '1',
            first: patientsPerPage,
            after: undefined,
            outstanding: false,
            underCareOf: true,
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
