import DecisionPointPage from 'pages/DecisionPoint';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DecisionPointType } from 'types/DecisionPoint';
import Patient from 'types/Patient';

interface ModalPatientProps {
  patient: Patient;
  closeCallback: () => void;
}

const ModalPatient = ({ patient, closeCallback }: ModalPatientProps) => (
  <Modal size="xl" fullscreen="md-down" show onHide={ closeCallback }>
    <Modal.Header closeButton>
      <Modal.Title>{patient.firstName} {patient.lastName} - {patient.hospitalNumber} </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Tabs>
        <TabList>
          <Tab>New Decision</Tab>
          <Tab>History</Tab>
          <Tab disabled>Messages</Tab>
          <Tab disabled>Notes</Tab>
        </TabList>
        <TabPanel>
          <DecisionPointPage
            hospitalNumber={ patient.hospitalNumber }
            decisionType={ DecisionPointType.TRIAGE }
          />
        </TabPanel>
        <TabPanel>
          test history
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

export default ModalPatient;
