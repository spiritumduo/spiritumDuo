/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { cache } from 'app/cache';
import { ClinicalRequestState } from '__generated__/globalTypes';
import DecisionPointPage, { CREATE_DECISION_POINT_MUTATION, GET_PATIENT_QUERY, GET_MDTS } from './DecisionPoint';

const mdts = [
  {
    id: '1',
    plannedAt: '3000-01-01T00:12:00',
  },
];

const patientHospitalNumber = 'fMRN1234567';
const clinicalRequestTypes = [
  {
    id: '1',
    name: 'ClinicalRequest Request',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
    isMdt: false,
  },
  {
    id: '2',
    name: 'X-Ray',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
    isMdt: false,
  },
  {
    id: '3',
    name: 'Other Request',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: false,
    isMdt: false,
  },
  {
    id: '4',
    name: 'Refer Somewhere',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: false,
    isMdt: false,
  },
  {
    id: '5',
    name: 'MRI Head',
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: true,
    isMdt: false,
  },
  {
    id: '6',
    name: 'Add to MDT',
    isMdt: true,
    isDischarge: false,
    isCheckboxHidden: false,
    isTestRequest: false,
  },
];

const clinicalRequests = [
  {
    id: '1',
    testResult: null,
    forwardDecisionPoint: null,
    clinicalRequestType: {
      name: 'MRI Head',
    },
    currentState: ClinicalRequestState.INIT,
    completedAt: null,
  },
  {
    id: '2',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: {
      id: '1',
    },
    testResult: {
      id: '1',
      description: 'X-Ray description from DP1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel suada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et suada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2021-12-12'),
    },
    clinicalRequestType: {
      name: 'X-Ray',
    },
  },
  {
    id: '3',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: {
      id: '2',
    },
    testResult: {
      id: '2',
      description: 'CT Thorax description from DP1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel suada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et suada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-07'),
    },
    clinicalRequestType: {
      name: 'CT Thorax',
    },
  },
  {
    id: '4',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: {
      id: '3',
    },
    testResult: {
      id: '3',
      description: 'EBUS description from DP2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel suada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et suada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-02'),
    },
    clinicalRequestType: {
      name: 'EBUS',
    },
  },
  {
    id: '5',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: null,
    testResult: null,
    clinicalRequestType: {
      name: 'MRI Head',
    },
  },
  {
    id: '6',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: null, // THIS SHOULD BE NEW
    testResult: {
      id: '4',
      description: 'Lung function description from DP3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel suada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et suada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-16'),
    },
    clinicalRequestType: {
      name: 'Lung function',
    },
  },
  {
    id: '7',
    currentState: ClinicalRequestState.COMPLETED,
    completedAt: new Date(),
    forwardDecisionPoint: null, // THIS SHOULD BE NEW
    testResult: {
      id: '5',
      description: 'PET-CT description from DP3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus tortor, hendrerit eu nibh a, vestibulum pretium libero. In vel auctor tellus, quis eleifend urna. Suspendisse dictum nunc facilisis pellentesque scelerisque. Aliquam vel suada enim, vitae rutrum ligula. Suspendisse neque felis, semper sit amet convallis sed, vulputate eu eros. Nulla vitae diam congue, fermentum lorem eu, interdum nulla. Interdum et suada fames ac ante ipsum primis in faucibus. Etiam id auctor nisi, eget suscipit massa. Vivamus eleifend rutrum convallis. Phasellus tempus laoreet orci et faucibus. In hac habitasse platea dictumst. In id maximus risus. Nulla consectetur nunc ex.',
      addedAt: new Date('2022-01-06'),
    },
    clinicalRequestType: {
      name: 'PET-CT',
    },
  },
];

const CREATE_DECISION_MOCK = {
  query: CREATE_DECISION_POINT_MUTATION,
  mockFn: (input: any) => Promise.resolve(
    input.input.clinicalRequestRequests[0]
      ? { data: {
        createDecisionPoint: {
          decisionPoint: {
            id: '1',
            clinicalRequests: [
              {
                id: '1',
                clinicalRequestType: {
                  id: '1',
                  name: 'TypeName',
                  isDischarge: false,
                },
              },
            ],
          },
          userErrors: null,
        },
      } }
      : {
        data: {
          createDecisionPoint: {
            decisionPoint: {
              id: '1',
              clinicalRequests: null,
            },
            userErrors: null,
          },
        },
      },
  ),
};

const clinician = {
  firstName: 'John',
  lastName: 'Doe',
};

const GET_PATIENT_MOCK = {
  query: GET_PATIENT_QUERY,
  mockFn: () => Promise.resolve({
    data: {
      getPatient: {
        id: '2',
        hospitalNumber: 'fMRN1234567',
        communicationMethod: 'LETTER',
        firstName: 'Michael',
        lastName: 'Myers',
        dateOfBirth: new Date('1970-06-12'),
        onPathways: [
          {
            id: '1',
            clinicalRequests: clinicalRequests,
            underCareOf: clinician,
            decisionPoints: [
              {
                clinicHistory: 'Clinic History 1',
                comorbidities: 'Comorbidities 1',
                clinicalRequests: [
                  clinicalRequests[0],
                  clinicalRequests[1],
                  clinicalRequests[2],
                ],
              },
              {
                clinicHistory: 'Clinic History 2',
                comorbidities: 'Comorbidities 2',
                clinicalRequests: [
                  clinicalRequests[3],
                  clinicalRequests[4],
                ],
              },
              {
                clinicHistory: 'Clinic History 3',
                comorbidities: 'Comorbidities 3',
                clinicalRequests: [
                  clinicalRequests[5],
                  clinicalRequests[6],
                ],
              },
              {
                clinicHistory: 'Clinic History 4',
                comorbidities: 'Comorbidities 4',
                clinicalRequests: null,
              },
            ],
          },
        ],
      },
      getClinicalRequestTypes: clinicalRequestTypes,
    },
  }),
};

const GET_MDTS_MOCK = {
  query: GET_MDTS,
  mockFn: () => Promise.resolve({
    data: {
      getMdts: mdts,
    },
  }),
};

const apolloMocks = [
  CREATE_DECISION_MOCK,
  GET_PATIENT_MOCK,
  GET_MDTS_MOCK,
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
              <NewMockSdApolloProvider mocks={ apolloMocks }>
                <DecisionPointPageStory />
              </NewMockSdApolloProvider>
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
  clinicalRequests: clinicalRequests,
  createDecisionMock: CREATE_DECISION_MOCK,
  getPatientMock: GET_PATIENT_MOCK,
  clinician: clinician,
  getMdtsMock: GET_MDTS_MOCK,
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
  clinicalRequests: clinicalRequests,
};
