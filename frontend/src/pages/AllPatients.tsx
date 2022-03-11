import React, { useContext } from 'react';
import './homepage.css';
import { PathwayContext } from 'app/context';
import WrappedPatientList from 'components/WrappedPatientList';
import { Link } from 'react-router-dom';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node } from 'components/__generated__/getPatientOnPathwayConnection';

export interface AllPatientsProps {
  patientsPerPage: number;
}

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
            outstanding={ false }
            underCareOf={ false }
            includeDischarged
          />
        </div>
      </div>
    </div>
  );
};

export default AllPatients;
