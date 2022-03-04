import React, { useContext } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Container } from 'nhsuk-react-components';

export interface HomePageProps {
  patientsPerPage: number;
}

// eslint-disable-next-line camelcase
type QueryPatient = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId as number;

  const linkFactory = (
    patient: QueryPatient,
  ) => <Link style={ { padding: '0' } } to={ `/decision/triage/${patient.hospitalNumber}` }>{ `${patient.firstName} ${patient.lastName}` }</Link>;

  return (
    <div className="row justify-content-center">
      <Tabs>
        <TabList>
          <Tab>Outstanding patients</Tab>
          <Tab>All patients</Tab>
        </TabList>
        <div className="col-10 offset-1">
          <TabPanel>
            <WrappedPatientList
              pathwayId={ pathwayId.toString() }
              patientsToDisplay={ patientsPerPage }
              linkFactory={ linkFactory }
              outstanding
              underCareOf
              includeDischarged={ false }
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
            />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

export default HomePage;
