import React, { useContext, useEffect, useState } from 'react';
import DecisionPointPage from 'pages/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import { Modal } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DecisionPointType } from 'types/DecisionPoint';
import Patient from 'types/Patient';
import { AuthContext } from 'app/context';
import { gql, useMutation } from '@apollo/client';
import { lockOnPathway } from './__generated__/lockOnPathway';

interface ModalPatientProps {
  patient: Patient;
  lockOnPathwayId?: string;
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

const ModalPatient = ({ patient, lockOnPathwayId, closeCallback }: ModalPatientProps) => {
  const [tabState, setTabState] = useState<boolean>(false);
  const [lockState, updateLockState] = useState<lockOnPathway | null | undefined>();
  const { user } = useContext(AuthContext);
  const [
    lockOnPathwayMutation, { data },
  ] = useMutation<lockOnPathway>(LOCK_ON_PATHWAY_MUTATION);

  const userId = user?.id.toString();
  const dataOnPathwayUserId = data?.lockOnPathway.onPathway?.lockUser?.id;
  const storedOnPathwayUserId = lockState?.lockOnPathway.onPathway?.lockUser?.id;
  if (dataOnPathwayUserId != null && storedOnPathwayUserId !== dataOnPathwayUserId) {
    updateLockState(data);
  }

  const hasLock = (
    (userId?.toString() === storedOnPathwayUserId)
    && (lockState?.lockOnPathway.onPathway?.lockEndTime > Date.now())
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
          {patient.firstName} {patient.lastName} - {patient.hospitalNumber}
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
              hospitalNumber={ patient.hospitalNumber }
              decisionType={ DecisionPointType.TRIAGE }
              onPathwayLock={ hasLock ? undefined : onPathwayLock }
              tabStateCallback={ setTabState }
            />
          </TabPanel>
          <TabPanel>
            <PreviousDecisionPoints hospitalNumber={ patient.hospitalNumber } />
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
