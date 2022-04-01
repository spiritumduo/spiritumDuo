/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Standard } from 'components/Notification.stories';
import { cache } from 'app/cache';
import DecisionPointPage, { CREATE_DECISION_POINT_MUTATION, GET_PATIENT_QUERY } from './DecisionPoint';

const patientHospitalNumber = 'fMRN1234567';
const milestoneTypes = [
  {
    id: '1',
    name: 'Milestone Request',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
  },
  {
    id: '2',
    name: 'X-Ray',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
  },
  {
    id: '3',
    name: 'Other Request',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: false,
  },
  {
    id: '4',
    name: 'Refer Somewhere',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: false,
  },
  {
    id: '5',
    name: 'MRI Head',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
  },
];

const milestones = [
  {
    id: '1',
    testResult: null,
    forwardDecisionPoint: null,
    milestoneType: {
      name: 'MRI Head',
    },
  },
  {
    id: '2',
    forwardDecisionPoint: {
      id: '1',
    },
    testResult: {
      id: '1',
      description: 'X-Ray description from DP1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel malesuada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2021-12-12'),
    },
    milestoneType: {
      name: 'X-Ray',
    },
  },
  {
    id: '3',
    forwardDecisionPoint: {
      id: '2',
    },
    testResult: {
      id: '2',
      description: 'CT Thorax description from DP1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel malesuada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-07'),
    },
    milestoneType: {
      name: 'CT Thorax',
    },
  },
  {
    id: '4',
    forwardDecisionPoint: {
      id: '3',
    },
    testResult: {
      id: '3',
      description: 'EBUS description from DP2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel malesuada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-02'),
    },
    milestoneType: {
      name: 'EBUS',
    },
  },
  {
    id: '5',
    forwardDecisionPoint: null,
    testResult: null,
    milestoneType: {
      name: 'MRI Head',
    },
  },
  {
    id: '6',
    forwardDecisionPoint: null, // THIS SHOULD BE NEW
    testResult: {
      id: '4',
      description: 'Lung function description from DP3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel malesuada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-16'),
    },
    milestoneType: {
      name: 'Lung function',
    },
  },
  {
    id: '7',
    forwardDecisionPoint: null, // THIS SHOULD BE NEW
    testResult: {
      id: '5',
      description: 'PET-CT description from DP3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel malesuada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-06'),
    },
    milestoneType: {
      name: 'PET-CT',
    },
  },
];

const CREATE_DECISION_NO_MILESTONE_MOCK = {
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
        milestoneResolutions: ['6', '7'],
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
};

const CREATE_DECISION_WITH_MILESTONE_MOCK = {
  // CREATE DECISION - WITH MILESTONES
  request: {
    query: CREATE_DECISION_POINT_MUTATION,
    variables: {
      input: {
        onPathwayId: '1',
        clinicHistory: 'New Clinic History',
        comorbidities: 'New Comorbidities',
        decisionType: DecisionPointType.TRIAGE.toString(),
        milestoneResolutions: ['6', '7'],
        milestoneRequests: [ // the order of these requests in this mock matters for some reason
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
                id: '1',
                name: 'TypeName',
                isDischarge: false,
              },
            },
          ],
        },
        userErrors: null,
      },
    },
  },
};

const apolloMocks = [
  {
    request: {
      query: GET_PATIENT_QUERY,
      variables: {
        hospitalNumber: patientHospitalNumber,
        pathwayId: 1, // this is a brittle, improve this
        includeDischarged: true,
      },
    },
    result: {
      data: {
        getPatient: {
          hospitalNumber: 'fMRN1234567',
          id: '1',
          communicationMethod: 'LETTER',
          firstName: 'John 36',
          lastName: 'Doe 36',
          dateOfBirth: new Date('1970-06-12'),
          onPathways: [
            {
              id: '1',
              milestones: milestones,
              underCareOf: {
                firstName: 'John',
                lastName: 'Doe',
              },
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
  CREATE_DECISION_NO_MILESTONE_MOCK,
  CREATE_DECISION_WITH_MILESTONE_MOCK,
];

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [
    (DecisionPointPageStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <DecisionPointPageStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

export const Default = Template.bind({});
export const Locked = Template.bind({});

Default.args = {
  hospitalNumber: patientHospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
};
Default.parameters = {
  milestones: milestones,
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};

Locked.args = {
  hospitalNumber: patientHospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
  onPathwayLock: {
    lockUser: {
      id: '1000',
      firstName: 'Johnny',
      lastName: 'Locker',
    },
    lockEndTime: new Date('2030-01-01'),
  },
};
Locked.parameters = {
  milestones: milestones,
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};
