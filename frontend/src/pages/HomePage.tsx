/* eslint-disable camelcase */
import React, { useState } from 'react';
import './homepage.css';
import Patient from 'types/Patient';
import PatientList, { PatientListDataFn } from 'components/PatientList';
import usePatientsForPathwayQuery from 'app/queries/UsePatientsForPathway';
import { DecisionPointType } from 'types/DecisionPoint';
import { getPatientOnPathwayConnection_getPatientOnPathwayConnection } from 'app/queries/__generated__/getPatientOnPathwayConnection';

export interface HomePageProps {
  triageData: Patient[];
  updateTriage: PatientListDataFn;
  clinicData: Patient[];
  updateClinic: PatientListDataFn;
  patientsPerPage: number;
}

const getHasNextPage = (
  data: getPatientOnPathwayConnection_getPatientOnPathwayConnection,
) => data.pageInfo.hasNextPage;

const getAfter = (
  data: getPatientOnPathwayConnection_getPatientOnPathwayConnection,
) => (
  data.edges && data.edges.length > 0
    ? data.edges[data.edges.length - 1]?.cursor
    : null
);

const updateQuery = (previousResult: any, { fetchMoreResult }: any) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  const previousEdges = previousResult.edges;
  const fetchMoreEdges = fetchMoreResult.edges;

  // eslint-disable-next-line no-param-reassign
  fetchMoreResult.edges = [...previousEdges, ...fetchMoreEdges];

  return { ...fetchMoreResult };
};

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
  console.log(`start: ${start}, end: ${end}, length: ${nodes.length}, allLength: ${allNodes.length}`);
  return (
    <>
      <div>{ error?.message }</div>
      <PatientList
        data={ nodes }
        isLoading={ loading }
        updateData={ ({ selected }) => {
          console.log(selected);
          setCurrentPage(selected);
          if (selected > maxFetchedPage) {
            if (pageInfo?.hasNextPage) {
              setMaxFetchedPage(selected);
              fetchMore({
                variables: {
                  after: pageInfo?.endCursor,
                  // first: patientsPerPage,
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

const HomePage = ({
  triageData, updateTriage, patientsPerPage,
  clinicData, updateClinic,
}: HomePageProps): JSX.Element => {
  // const patientsPerPage = 20; // TODO: This should change dynamic as page is resized
  const pathwayId = 1;

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
