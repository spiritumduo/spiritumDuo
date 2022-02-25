import React, { useContext } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';

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
    <div className="container">
      <div className="col-12 col-xxl-6 row mt-1 justify-content-start">
        <div>
          <h3>Outstanding Decisions</h3>
          <WrappedPatientList
            pathwayId={ pathwayId.toString() }
            patientsToDisplay={ patientsPerPage }
            linkFactory={ linkFactory }
            outstanding
            underCareOf
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
