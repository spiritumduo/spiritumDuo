import React, { useContext, useState } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Modal } from 'react-bootstrap';
import { Container } from 'nhsuk-react-components';

export interface HomePageProps {
  patientsPerPage: number;
}

// eslint-disable-next-line camelcase
type QueryPatient = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const [modalPatient, setModalPatient] = useState(false);
  const pathwayId = currentPathwayId as number;

  const linkFactory = (
    patient: QueryPatient,
  ) => <Link style={ { padding: '0' } } to={ `/decision/triage/${patient.hospitalNumber}` }>{ `${patient.firstName} ${patient.lastName}` }</Link>;

  return (
    <>
      <Container>
        <Tabs>
          <TabList>
            <Tab>Outstanding patients</Tab>
            <Tab>All patients</Tab>
          </TabList>
          <div>
            <TabPanel>
              <WrappedPatientList
                pathwayId={ pathwayId.toString() }
                patientsToDisplay={ patientsPerPage }
                linkFactory={ linkFactory }
                outstanding
                underCareOf
                includeDischarged={ false }
                setModalPatient={ setModalPatient }
              />
            </TabPanel>
            <TabPanel>
              <WrappedPatientList
                pathwayId={ pathwayId.toString() }
                patientsToDisplay={ patientsPerPage }
                linkFactory={ linkFactory }
                outstanding
                underCareOf
                includeDischarged={ false }
                setModalPatient={ setModalPatient }
              />
            </TabPanel>
          </div>
        </Tabs>
      </Container>
      <Modal size="xl" fullscreen="md-down" show={ !!modalPatient } onHide={ () => { setModalPatient(false); } }>
        <Modal.Header closeButton>
          <Modal.Title>{modalPatient || ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs>
            <TabList>
              <Tab>New record</Tab>
              <Tab>History</Tab>
              <Tab disabled>Messages</Tab>
              <Tab disabled>Notes</Tab>
            </TabList>
            <TabPanel>
              test
            </TabPanel>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HomePage;
