import DecisionPointPage from 'pages/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
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
  <Modal size="xl" fullscreen="lg-down" show onHide={ closeCallback }>
    <Modal.Header closeButton>
      <Modal.Title>{patient.firstName} {patient.lastName} - {patient.hospitalNumber} </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Tabs>
        <TabList>
          <Tab>New Decision</Tab>
          <Tab>Previous Decisions</Tab>
          <Tab disabled>Messages</Tab>
          <Tab disabled>Notes</Tab>
        </TabList>
        <TabPanel forceRender>
          <DecisionPointPage
            hospitalNumber={ patient.hospitalNumber }
            decisionType={ DecisionPointType.TRIAGE }
          />
        </TabPanel>
        <TabPanel forceRender>
          <PreviousDecisionPoints hospitalNumber={ patient.hospitalNumber } />
        </TabPanel>
        <TabPanel forceRender>
          test message
        </TabPanel>
        <TabPanel forceRender>
          test notes
        </TabPanel>
      </Tabs>
    </Modal.Body>
  </Modal>
);

export default ModalPatient;
