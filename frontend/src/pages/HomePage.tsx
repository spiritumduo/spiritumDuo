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
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';
import { setModalPatientHospitalNumber } from 'pages/HomePage.slice';

export interface HomePageProps {
  patientsPerPage: number;
}

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId as number;
  const dispatch = useAppDispatch();
  const modalPatientNumber = useAppSelector(
    (state: RootState) => state.homePage.modalPatientHospitalNumber,
  );

  const modalCloseCallback = () => {
    dispatch(setModalPatientHospitalNumber(undefined));
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
            />
          </TabPanel>
          <TabPanel>
            <WrappedPatientList
              pathwayId={ pathwayId.toString() }
              patientsToDisplay={ patientsPerPage }
              outstanding={ false }
              underCareOf={ false }
              includeDischarged
            />
          </TabPanel>
        </Tabs>
      </Container>
      {
        modalPatientNumber
          ? (
            <ModalPatient
              hospitalNumber={ modalPatientNumber }
              closeCallback={ modalCloseCallback }
              lock
            />
          )
          : false
      }
    </>
  );
};

export default HomePage;
