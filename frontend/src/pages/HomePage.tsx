import React, { useContext, useState } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Container } from 'nhsuk-react-components';
import Patient from 'types/Patient';
import ModalPatient from 'components/ModalPatient';

export interface HomePageProps {
  patientsPerPage: number;
}

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const [patient, setPatient] = useState<Patient | null>(null);
  const pathwayId = currentPathwayId as number;

  const modalCloseCallback = () => {
    setPatient(null);
  };

  return (
    <>
      <Container>
        <Tabs>
          <TabList>
            <Tab>To do</Tab>
            <Tab>All patients</Tab>
          </TabList>
          <div>
            <TabPanel>
              <WrappedPatientList
                pathwayId={ pathwayId.toString() }
                patientsToDisplay={ patientsPerPage }
                outstanding
                underCareOf
                patientOnClick={ setPatient }
              />
            </TabPanel>
            <TabPanel>
              <WrappedPatientList
                pathwayId={ pathwayId.toString() }
                patientsToDisplay={ patientsPerPage }
                outstanding={ false }
                underCareOf={ false }
                includeDischarged
                patientOnClick={ setPatient }
              />
            </TabPanel>
          </div>
        </Tabs>
      </Container>
      {
        patient
          ? <ModalPatient patient={ patient } closeCallback={ modalCloseCallback } />
          : false
      }
    </>
  );
};

export default HomePage;
