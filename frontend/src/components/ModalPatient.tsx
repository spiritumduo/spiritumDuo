import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';

// LIBRARIES
import { Modal, Container, Col, Row } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { gql, useQuery, useMutation } from '@apollo/client';
import { BsX } from 'react-icons/bs';

// APP
import { DecisionPointType } from 'types/DecisionPoint';
import { AuthContext, PathwayContext } from 'app/context';
import { useAppSelector } from 'app/hooks';
import { useHospitalNumberFormat, useNationalNumberFormat } from 'app/hooks/format-identifier';
import { RootState } from 'app/store';

// PAGES
import DecisionPointPage from 'features/DecisionPoint/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import PatientPathway from 'features/PatientPathway/PatientPathway';
import PatientMdtTab from 'features/PatientMdtTab/PatientMdtTab';

// LOCAL
import { lockOnPathway } from './__generated__/lockOnPathway';
import { getPatientOnCurrentPathway } from './__generated__/getPatientOnCurrentPathway';

export enum ModalPatientTab {
  NEW_DECISION = 0,
  PAST_DECISION = 1,
  MDT = 2,
}

interface ModalPatientProps {
  hospitalNumber: string;
  lock?: boolean;
  closeCallback: () => void;
  mdtId?: string;
  defaultTab?: ModalPatientTab;
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
      hospitalNumber
      nationalNumber
      dateOfBirth
      sex
      onPathways(pathwayId: $pathwayId, includeDischarged: true) {
        id
      }
    }
  }
`;

const ModalPatient = (
  { hospitalNumber, closeCallback, lock, mdtId, defaultTab }: ModalPatientProps,
) => {
  // START HOOKS
  const tabState = useAppSelector((state: RootState) => state.modalPatient.isTabDisabled);
  // const onMdtWorkflow = useAppSelector((state: RootState) => state.onMdtWorkflow.onMdtWorkflow);
  const { currentPathwayId } = useContext(PathwayContext);
  const { user } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const formatHospitalNumber = useHospitalNumberFormat();
  const formatNationalNumber = useNationalNumberFormat();

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

  useLayoutEffect(() => setCurrentTab(defaultTab || 0), [defaultTab]);

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
  const currentPatient = patientData?.getPatient;

  return (
    <Modal container={ document.getElementById('root') } size="xl" fullscreen="lg-down" show onHide={ closeCallback }>
      <Modal.Header>
        <Modal.Title className="w-100">
          <Container>
            <Row>
              <Col md="11" xs="10">
                <div className="visually-hidden">
                  {`${currentPatient?.firstName} ${currentPatient?.lastName},    ${formatHospitalNumber(currentPatient?.hospitalNumber)},    ${formatNationalNumber(currentPatient?.nationalNumber)},    ${currentPatient?.dateOfBirth.toLocaleDateString()}`}
                </div>
                <PatientPathway
                  hospitalNumber={ hospitalNumber }
                  maxDays={ 80 }
                  showName
                  showNationalNumber
                />
              </Col>
              <Col md="1" xs="1">
                <button
                  type="button"
                  className="bg-transparent"
                  name="Close"
                  style={ { border: 'none' } }
                  onClick={ () => closeCallback() }
                >
                  <span className="nhsuk-u-visually-hidden">Close</span>
                  <BsX size="2rem" />
                </button>
              </Col>
            </Row>
          </Container>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs onSelect={ (index) => setCurrentTab(index) } selectedIndex={ currentTab }>
          <TabList>
            <Tab disabled={ tabState }>New Decision</Tab>
            <Tab disabled={ tabState }>Previous Decisions</Tab>
            <Tab disabled={ tabState }>MDT</Tab>
            <Tab disabled>Messages</Tab>
            <Tab disabled>Notes</Tab>
          </TabList>
          <TabPanel>
            <DecisionPointPage
              hospitalNumber={ hospitalNumber }
              decisionType={ DecisionPointType.CLINIC }
              onPathwayLock={ hasLock ? undefined : onPathwayLock }
              closeCallback={ () => closeCallback() }
              fromMdtId={ mdtId }
            />
          </TabPanel>
          <TabPanel>
            <PreviousDecisionPoints hospitalNumber={ hospitalNumber } />
          </TabPanel>
          <TabPanel>
            <PatientMdtTab patientId={ patientData?.getPatient?.id } />
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
