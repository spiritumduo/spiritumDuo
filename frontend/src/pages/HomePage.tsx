import React, { useCallback, useContext } from 'react';

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
import AllPatients from 'features/AllPatients/AllPatients';

// LOCAL IMPORT
import './homepage.css';
import { setModalPatientHospitalNumber } from './HomePage.slice';

export interface HomePageProps {
  patientsPerPage: number;
  modalPatient?: boolean;
  allPatients?: boolean;
}

const HomePage = ({ patientsPerPage, modalPatient, allPatients }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId as string;
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

  const onSelect = useCallback((index: number) => {
    switch (index) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/patients/all');
        break;
      default:
    }
  }, [navigate]);

  return (
    <>
      <Container>
        <Tabs selectedIndex={ allPatients ? 1 : 0 } onSelect={ onSelect }>
          <TabList>
            <Tab>To do</Tab>
            <Tab>All patients</Tab>
          </TabList>
          <TabPanel>
            <WrappedPatientList
              pathwayId={ pathwayId }
              patientsToDisplay={ patientsPerPage }
              outstanding
              underCareOf
            />
          </TabPanel>
          <TabPanel>
            <AllPatients pathwayId={ pathwayId } patientsPerPage={ patientsPerPage } />
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
