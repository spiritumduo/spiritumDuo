/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { DefaultLayout } from 'components/PageLayout.stories';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import DecisionPointPage, { CREATE_DECISION_POINT_MUTATION, GET_PATIENT_QUERY } from './DecisionPoint';

const patientHospitalNumber = 'MRN1234567-36';
const milestoneTypes = [
  {
    id: '1',
    name: 'Milestone Request',
  },
  {
    id: '2',
    name: 'X-Ray',
  },
  {
    id: '3',
    name: 'Other Request',
  },
  {
    id: '4',
    name: 'Refer Somewhere',
  },
  {
    id: '5',
    name: 'MRI Head',
  },
];

const milestones = [
  {
    testResult: null,
    milestoneType: {
      name: 'MRI Head',
    },
  },
  {
    testResult: {
      id: '1',
      description: 'X-Ray description from CH1',
      addedAt: new Date('2021-12-12'),
    },
    milestoneType: {
      name: 'X-Ray',
    },
  },
  {
    testResult: {
      id: '2',
      description: 'CT Thorax description from CH1',
      addedAt: new Date('2021-12-14'),
    },
    milestoneType: {
      name: 'CT Thorax',
    },
  },
  {
    testResult: {
      id: '3',
      description: 'EBUS description from CH2',
      addedAt: new Date('2022-01-02'),
    },
    milestoneType: {
      name: 'EBUS',
    },
  },
  {
    testResult: null,
    milestoneType: {
      name: 'MRI Head',
    },
  },
  {
    testResult: {
      id: '4',
      description: 'Lung function description from CH3',
      addedAt: new Date('2022-01-06'),
    },
    milestoneType: {
      name: 'Lung function',
    },
  },
  {
    testResult: {
      id: '5',
      description: 'PET-CT description from CH3',
      addedAt: new Date('2022-01-06'),
    },
    milestoneType: {
      name: 'PET-CT',
    },
  },
];
const apolloMocks = [
  {
    request: {
      query: GET_PATIENT_QUERY,
      variables: {
        hospitalNumber: patientHospitalNumber,
        pathwayId: 1, // this is a brittle, improve this
      },
    },
    result: {
      data: {
        getPatient: {
          hospitalNumber: 'MRN1234567-36',
          id: '1637',
          communicationMethod: 'LETTER',
          firstName: 'John 36',
          lastName: 'Doe 36',
          dateOfBirth: new Date('1970-06-12'),
          onPathways: [
            {
              id: '1',
              decisionPoints: [
                {
                  clinicHistory: 'Clinic History 1',
                  comorbidities: 'Comorbidities 1',
                  milestones: [
                    milestones[0],
                    milestones[1],
                    milestones[2],
                  ],
                },
                {
                  clinicHistory: 'Clinic History 2',
                  comorbidities: 'Comorbidities 2',
                  milestones: [
                    milestones[3],
                    milestones[4],
                  ],
                },
                {
                  clinicHistory: 'Clinic History 3',
                  comorbidities: 'Comorbidities 3',
                  milestones: [
                    milestones[5],
                    milestones[6],
                  ],
                },
                {
                  clinicHistory: 'Clinic History 4',
                  comorbidities: 'Comorbidities 4',
                  milestones: null,
                },
              ],
            },
          ],
        },
        getMilestoneTypes: milestoneTypes,
      },
    },
  },
  {
    // CREATE DECISION - NO MILESTONES
    request: {
      query: CREATE_DECISION_POINT_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
          clinicHistory: 'New Clinic History',
          comorbidities: 'New Comorbidities',
          decisionType: DecisionPointType.TRIAGE.toString(),
          milestoneRequests: [],
        },
      },
    },
    result: {
      data: {
        createDecisionPoint: {
          decisionPoint: {
            id: '1',
            milestones: null,
          },
          userErrors: null,
        },
      },
    },
  },
  {
    // CREATE DECISION - WITH MILESTONES
    request: {
      query: CREATE_DECISION_POINT_MUTATION,
      variables: {
        input: {
          onPathwayId: '1',
          clinicHistory: 'New Clinic History',
          comorbidities: 'New Comorbidities',
          decisionType: DecisionPointType.TRIAGE.toString(),
          milestoneRequests: [
            {
              milestoneTypeId: milestoneTypes[0].id,
            },
            {
              milestoneTypeId: milestoneTypes[1].id,
            },
            {
              milestoneTypeId: milestoneTypes[2].id,
            },
            {
              milestoneTypeId: milestoneTypes[3].id,
            },
            {
              milestoneTypeId: milestoneTypes[4].id,
            },
          ],
        },
      },
    },
    result: {
      data: {
        createDecisionPoint: {
          decisionPoint: {
            id: '1',
            milestones: [
              {
                id: '1',
                milestoneType: {
                  name: 'TypeName',
                },
              },
            ],
          },
          userErrors: null,
        },
      },
    },
  },
];

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [
    (DecisionPointPageStory) => (
      <MemoryRouter>
        <MockAuthProvider>
          <MockPathwayProvider>
            <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
              <DecisionPointPageStory />
            </PageLayout>
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

export const Default = Template.bind({});
Default.args = {
  hospitalNumber: patientHospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
};
Default.parameters = {
  milestones: milestones,
  apolloClient: {
    mocks: apolloMocks,
  },
};
