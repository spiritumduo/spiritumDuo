/* eslint-disable camelcase */
import React, { useState } from 'react';
import './homepage.css';
import Patient from 'types/Patient';
import PatientList from 'components/PatientList';
import usePatientsForPathwayQuery from 'app/queries/UsePatientsForPathway';
import { DecisionPointType } from 'types/DecisionPoint';
import { getPatientOnPathwayConnection } from 'app/queries/__generated__/getPatientOnPathwayConnection';
import { PatientLink } from 'components/Link';

export interface HomePageProps {
  patientsPerPage: number;
}

function edgesToNodes(
  data: getPatientOnPathwayConnection | undefined, currentPage: number, patientsPerPage: number,
) {
  const pageCount = data
    ? Math.ceil(data.getPatientOnPathwayConnection.totalCount / patientsPerPage)
    : 0;

  const allNodes = data
    ? data.getPatientOnPathwayConnection.edges?.map((edge) => edge?.node) as unknown as Patient[]
    : [];
  const pageInfo = data?.getPatientOnPathwayConnection.pageInfo;

  const start = currentPage * patientsPerPage;
  const end = start + patientsPerPage;
  const nodes = allNodes.slice(start, end);

  return { nodes, pageCount, pageInfo };
}

const WrappedPatientList = ({
  pathwayId,
  patientsPerPage,
  decisionPointType,
}: {
  pathwayId: number,
  patientsPerPage: number,
  decisionPointType: DecisionPointType,
}): JSX.Element => {
  const {
    loading,
    error,
    data,
    fetchMore,
  } = usePatientsForPathwayQuery(pathwayId, decisionPointType, patientsPerPage);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const { nodes, pageCount, pageInfo } = edgesToNodes(data, currentPage, patientsPerPage);
  const lowerCaseDecisionType = decisionPointType.toString().toLowerCase();
  const listElements: JSX.Element[] = nodes.map((n) => <PatientLink key={ n.id } patient={ n } to={ `/decision/${lowerCaseDecisionType}/${n.hospitalNumber}` } />);

  return (
    <>
      <div>{ error?.message }</div>
      <PatientList
        data={ listElements }
        isLoading={ loading }
        updateData={ ({ selected }) => {
          setCurrentPage(selected);
          if (selected > maxFetchedPage) {
            if (pageInfo?.hasNextPage) {
              setMaxFetchedPage(selected);
              fetchMore({
                variables: {
                  after: pageInfo?.endCursor,
                },
              });
            }
          }
        } }
        pageCount={ pageCount }
      />
    </>
  );
};

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  // const patientsPerPage = 20; // TODO: This should change dynamic as page is resized
  const pathwayId = 9;

  return (
    <div className="container text-center">
      <div className="row mt-1">
        <div className="col">
          <h4>Patients Needing Triage</h4>
          <WrappedPatientList
            pathwayId={ pathwayId }
            patientsPerPage={ patientsPerPage }
            decisionPointType={ DecisionPointType.TRIAGE }
          />
        </div>
        <div className="col">
          <h4>Clinic Patients</h4>
          <WrappedPatientList
            pathwayId={ pathwayId }
            patientsPerPage={ patientsPerPage }
            decisionPointType={ DecisionPointType.CLINIC }
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
