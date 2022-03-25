import React, { useState } from 'react';
import DecisionPointPage from 'pages/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import { Modal } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DecisionPointType } from 'types/DecisionPoint';
import Patient from 'types/Patient';

interface ModalPatientProps {
  patient: Patient;
  closeCallback: () => void;
}

const ModalPatient = ({ patient, closeCallback }: ModalPatientProps) => {
  const [tabState, setTabState] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [decisionPointOnClose, setDecisionPointOnClose] = useState(() => () => {});
  const decisionPointClose = (callback: () => void) => {
    setDecisionPointOnClose(() => callback);
  };
  const onHide = () => {
    decisionPointOnClose();
    closeCallback();
  };

  return (
    <Modal size="xl" fullscreen="lg-down" show onHide={ onHide }>
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
              tabStateCallback={ setTabState }
              onClose={ decisionPointClose }
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
