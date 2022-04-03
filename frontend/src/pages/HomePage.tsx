import React, { useContext, useState } from 'react';

// LIBRARIES
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Container } from 'nhsuk-react-components';

// APP
import { PathwayContext } from 'app/context';
import Patient from 'types/Patient';

// COMPONENTS
import WrappedPatientList from 'components/WrappedPatientList';
import ModalPatient from 'components/ModalPatient';

// LOCAL IMPORT
import './homepage.css';

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
        </Tabs>
      </Container>
      {
        patient
          ? <ModalPatient patient={ patient } closeCallback={ modalCloseCallback } lock />
          : false
      }
    </>
  );
};

export default HomePage;
