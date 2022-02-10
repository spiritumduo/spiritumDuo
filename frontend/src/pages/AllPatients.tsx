import React, { useContext } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';

export interface AllPatientsProps {
  patientsPerPage: number;
}

// eslint-disable-next-line camelcase
type QueryPatient = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;
const linkFactory = (
  patient: QueryPatient,
) => <Link style={ { padding: '0' } } to={ `/patient/${patient.hospitalNumber}` }>{ `${patient.firstName} ${patient.lastName}` }</Link>;

const AllPatients = ({ patientsPerPage }: AllPatientsProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId || 1;

  return (
    <div className="container">
      <div className="row mt-1 justify-content-start">
        <div className="col">
          <h3>All Patients</h3>
          <WrappedPatientList
            pathwayId={ pathwayId.toString() }
            patientsToDisplay={ patientsPerPage }
            linkFactory={ linkFactory }
            outstanding={ false }
            underCareOf={ false }
          />
        </div>
      </div>
    </div>
  );
};

export default AllPatients;
