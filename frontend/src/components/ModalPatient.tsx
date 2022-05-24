import React, { useContext, useEffect } from 'react';

// LIBRARIES
import { Modal } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { gql, useQuery, useMutation } from '@apollo/client';

// APP
import { DecisionPointType } from 'types/DecisionPoint';
import { AuthContext, PathwayContext } from 'app/context';
import { useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';

// PAGES
import DecisionPointPage from 'features/DecisionPoint/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';

// LOCAL
import { lockOnPathway } from './__generated__/lockOnPathway';
import { getPatientOnCurrentPathway } from './__generated__/getPatientOnCurrentPathway';

interface ModalPatientProps {
  hospitalNumber: string;
  lock?: boolean;
  closeCallback: () => void;
}

export const LOCK_ON_PATHWAY_MUTATION = gql`
  mutation lockOnPathway($input: LockOnPathwayInput!){
    lockOnPathway(input: $input){
      onPathway{
        id
        lockUser{
          id
          firstName
          lastName
        }
        lockEndTime
      }
      userErrors{
        field
        message
      }
    }
  }
`;

export const GET_PATIENT_CURRENT_PATHWAY_QUERY = gql`
  query getPatientOnCurrentPathway($hospitalNumber: String!, $pathwayId: ID!) {
    getPatient(hospitalNumber: $hospitalNumber) {
      id
      firstName
      lastName
      onPathways(pathwayId: $pathwayId, includeDischarged: true) {
        id
      }
    }
  }
`;

const ModalPatient = ({ hospitalNumber, closeCallback, lock }: ModalPatientProps) => {
  // START HOOKS
  const tabState = useAppSelector((state: RootState) => state.modalPatient.isTabDisabled);
  const { currentPathwayId } = useContext(PathwayContext);
  const { user } = useContext(AuthContext);

  const [
    lockOnPathwayMutation, { data },
  ] = useMutation<lockOnPathway>(LOCK_ON_PATHWAY_MUTATION);
  const {
    data: patientData,
  } = useQuery<getPatientOnCurrentPathway>(
    GET_PATIENT_CURRENT_PATHWAY_QUERY, {
      variables: {
        hospitalNumber: hospitalNumber,
        pathwayId: currentPathwayId,
      },
    },
  );
  const lockOnPathwayId = lock
    ? patientData?.getPatient?.onPathways?.[0]?.id
    : undefined;

  const userId = user?.id;
  const storedOnPathwayUserId = data?.lockOnPathway.onPathway?.lockUser?.id;

  const hasLock = (
    (userId?.toString() === storedOnPathwayUserId)
    && (data?.lockOnPathway.onPathway?.lockEndTime > Date.now())
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (lockOnPathwayId) {
      if (!hasLock) {
        lockOnPathwayMutation({ variables: { input: { onPathwayId: lockOnPathwayId } } });
      }
      const lockInterval = setInterval(() => {
        lockOnPathwayMutation(
          { variables: { input: { onPathwayId: lockOnPathwayId } } },
        );
      }, 150 * 1000);

      if (hasLock) {
        return () => {
          clearInterval(lockInterval);
          if (lockOnPathwayId) {
            lockOnPathwayMutation({
              variables: { input: {
                onPathwayId: lockOnPathwayId,
                unlock: true,
              } },
            });
          }
        };
      }
      return () => {
        clearInterval(lockInterval);
      };
    }
  }, [hasLock, lockOnPathwayId, lockOnPathwayMutation]);
  // NO MORE HOOKS AFTER HERE

  const onPathway = data?.lockOnPathway.onPathway;
  const onPathwayLock = onPathway?.lockEndTime && onPathway.lockUser
    ? {
      lockEndTime: onPathway.lockEndTime,
      lockUser: onPathway.lockUser,
    }
    : undefined;

  return (
    <Modal size="xl" fullscreen="lg-down" show onHide={ closeCallback }>
      <Modal.Header closeButton>
        <Modal.Title>
          {`${patientData?.getPatient?.firstName} ${patientData?.getPatient?.lastName} - ${hospitalNumber}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs>
          <TabList>
            <Tab disabled={ tabState }>New Decision</Tab>
            <Tab disabled={ tabState }>Previous Decisions</Tab>
            <Tab disabled>Messages</Tab>
            <Tab disabled>Notes</Tab>
          </TabList>
          <TabPanel>
            <DecisionPointPage
              hospitalNumber={ hospitalNumber }
              decisionType={ DecisionPointType.CLINIC }
              onPathwayLock={ hasLock ? undefined : onPathwayLock }
            />
          </TabPanel>
          <TabPanel>
            <PreviousDecisionPoints hospitalNumber={ hospitalNumber } />
          </TabPanel>
          <TabPanel>
            test message
          </TabPanel>
          <TabPanel>
            test notes
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPatient;
