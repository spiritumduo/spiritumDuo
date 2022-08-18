import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ModalPatient, { GET_PATIENT_CURRENT_PATHWAY_QUERY, LOCK_ON_PATHWAY_MUTATION } from 'components/ModalPatient';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import { Default as PreviousDecisionPointsStory } from 'pages/PreviousDecisionPoints.stories';
import { Default as DecisionPointsStory } from 'features/DecisionPoint/DecisionPoint.stories';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { Default as PatientPathwayDefault } from 'features/PatientPathway/PatientPathway.stories';
import { useAppDispatch } from 'app/hooks';

const patient = {
  id: '1',
  firstName: 'Bilbo',
  lastName: 'Baggins',
  hospitalNumber: 'fMRN1234567',
  dateOfBirth: new Date('1970-06-12'),
  sex: 'MALE',
  nationalNumber: 'fNHS12345678',
};

const userHasLockMocks = {
  query: LOCK_ON_PATHWAY_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      lockOnPathway: {
        onPathway: {
          id: '1',
          lockEndTime: new Date('2030-01-01'),
          lockUser: {
            id: '1',
            firstName: 'Test-John',
            lastName: 'Test-Doe',
            username: 'test-john-doe',
          },
        },
        userErrors: null,
      },
    },
  }),
};

const userDoesNotHaveLockMocks = {
  query: LOCK_ON_PATHWAY_MUTATION,
  mockFn: () => Promise.resolve({
    data: {
      lockOnPathway: {
        onPathway: {
          id: '1',
          lockEndTime: new Date('2030-01-01'),
          lockUser: {
            id: '1000',
            firstName: 'Not',
            lastName: 'You',
            username: 'notyou',
          },
        },
        userErrors: [{
          field: 'lock_end_time',
          message: 'A lock is already in place by another user!',
        }],
      },
    },
  }),
};

const patientMock = {
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
};

export default {
  title: 'Components/Modal Patient',
  component: ModalPatient,
  argTypes: { closeCallback: { action: 'clicked' } },
  decorators: [
    (ModalPatientStory) => (
      <MockAuthProvider>
        <MockPathwayProvider>
          <ModalPatientStory />
        </MockPathwayProvider>
      </MockAuthProvider>
    ),
  ],
} as ComponentMeta<typeof ModalPatient>;

export const Default: ComponentStory<typeof ModalPatient> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        patientMock,
        userHasLockMocks,
        ...PatientPathwayDefault.parameters?.mocks,
        DecisionPointsStory.parameters?.createDecisionMock,
        DecisionPointsStory.parameters?.getPatientMock,
        DecisionPointsStory.parameters?.getMdtsMock,
        PreviousDecisionPointsStory.parameters?.getPatientMock,
      ]
    }
  >
    <ModalPatient
      hospitalNumber={ patient.hospitalNumber }
      closeCallback={ () => ({}) }
    />
  </NewMockSdApolloProvider>
);

Default.args = {
  hospitalNumber: patient.hospitalNumber,
  lock: true,
};

Default.parameters = {
  patient: patient,
  patientMock: patientMock,
  userHasLockMocks: userHasLockMocks,
};

export const LockedByOtherUser: ComponentStory<typeof ModalPatient> = () => (
  <NewMockSdApolloProvider
    mocks={
      [
        userDoesNotHaveLockMocks,
        patientMock,
        DecisionPointsStory.parameters?.getPatientMock,
        PreviousDecisionPointsStory.parameters?.getPatientMock,
        DecisionPointsStory.parameters?.getMdtsMock,
      ]
    }
  >
    <ModalPatient
      hospitalNumber={ patient.hospitalNumber }
      closeCallback={ () => ({}) }
      lock
    />
  </NewMockSdApolloProvider>
);

LockedByOtherUser.args = {
  hospitalNumber: patient.hospitalNumber,
  lock: true,
};

LockedByOtherUser.parameters = {
  patient: patient,
};
