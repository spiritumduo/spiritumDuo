import React, { useCallback, useContext, useState } from 'react';

// LIBRARIES
import { Container, Select } from 'nhsuk-react-components';
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
import PatientPathwayList from 'features/PatientPathwayList/PatientPathwayList';

// LOCAL IMPORT
import './homepage.css';
import { setModalPatientHospitalNumber } from './HomePage.slice';

type PatientListTabProps = React.PropsWithChildren<{
  pathwayId: string;
  patientsPerPage: number;
  outstanding?: boolean;
  underCareOf?: boolean;
}>;

const PatientListTab = (
  { pathwayId, patientsPerPage, outstanding, underCareOf, children }: PatientListTabProps,
) => {
  const [isTimelineView, setIsTimelineView] = useState<boolean>(false);
  return (
    <>
      <div className="text-end select-container">
        <Select onChange={ (e) => {
          setIsTimelineView((e.target as HTMLSelectElement).value === 'timeline');
        } }
        >
          <option value="table">List</option>
          <option value="timeline">Graphical</option>
        </Select>
      </div>
      {
        isTimelineView
          ? (
            <div>
              <PatientPathwayList
                pathwayId={ pathwayId }
                patientsToDisplay={ patientsPerPage }
                outstanding={ outstanding }
                underCareOf={ underCareOf }
              />
            </div>
          )
          : (
            <WrappedPatientList
              pathwayId={ pathwayId }
              patientsToDisplay={ patientsPerPage }
              outstanding
              underCareOf
            />
          )
        }
    </>
  );
};

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
  const onMdtWorkflow = useAppSelector((state: RootState) => state.onMdtWorkflow.onMdtWorkflow);

  if (modalPatient) dispatch(setModalPatientHospitalNumber(hospitalNumber));

  const modalCloseCallback = () => {
    dispatch(setModalPatientHospitalNumber(undefined));
    if (onMdtWorkflow) {
      navigate(`/mdt/${onMdtWorkflow}`);
    } else {
      navigate('/');
    }
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
            <PatientListTab
              pathwayId={ pathwayId }
              patientsPerPage={ patientsPerPage }
              outstanding
              underCareOf
            />
          </TabPanel>
          <TabPanel>
            <PatientListTab pathwayId={ pathwayId } patientsPerPage={ patientsPerPage } />
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
