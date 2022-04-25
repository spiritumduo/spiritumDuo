import React, { useContext } from 'react';

// LIBRARIES
import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams, useNavigate } from 'react-router';

// APP
import { PathwayContext } from 'app/context';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';

// COMPONENTS
import WrappedPatientList from 'components/WrappedPatientList';
import ModalPatient from 'components/ModalPatient';

// LOCAL IMPORT
import './homepage.css';
import { setModalPatientHospitalNumber } from './HomePage.slice';

export interface HomePageProps {
  patientsPerPage: number;
  modalPatient?: boolean;
}

const HomePage = ({ patientsPerPage, modalPatient }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId as number;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hospitalNumber } = useParams();
  const modalPatientNumber = useAppSelector(
    (state: RootState) => state.homePage.modalPatientHospitalNumber,
  );

  if (modalPatient) dispatch(setModalPatientHospitalNumber(hospitalNumber));

  const modalCloseCallback = () => {
    dispatch(setModalPatientHospitalNumber(undefined));
    navigate('/');
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
