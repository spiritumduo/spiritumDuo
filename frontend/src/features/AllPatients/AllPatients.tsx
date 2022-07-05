import React, { useContext, useMemo, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';
import WrappedPatientList from 'components/WrappedPatientList';
import PatientList, { PatientListProps, PatientListUpdateDataFn } from 'components/PatientList';
import { gql, useQuery } from '@apollo/client';
import { AuthContext, PathwayContext } from 'app/context';
import { setModalPatientHospitalNumber } from 'pages/HomePage.slice';

import { patientSearch } from './__generated__/patientSearch';

export const PATIENT_SEARCH_QUERY = gql`
  query patientSearch($query: String!, $pathwayId: ID!) {
      patientSearch(query: $query, pathwayId: $pathwayId) {
          id
          firstName
          lastName
          hospitalNumber
          nationalNumber
          dateOfBirth
          onPathways(pathwayId: $pathwayId, includeDischarged: true) {
            outstandingClinicalRequest: clinicalRequests(outstanding: true, limit: 1) {
              id
              updatedAt
              clinicalRequestType {
                name
              }
            }
            clinicalRequest: clinicalRequests(outstanding: false, limit: 1) {
              id
              updatedAt
              clinicalRequestType {
                name
              }
            }
            lockUser {
              id
              firstName
              lastName
            }
            lockEndTime
          }
      }
  }
`;

interface SearchResultsProps {
  query: string;
  patientsPerPage: number;
}

const SearchResults = ({ query, patientsPerPage }: SearchResultsProps) => {
  const { currentPathwayId } = useContext(PathwayContext);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useAppDispatch();

  const { data, loading, error } = useQuery<patientSearch>(PATIENT_SEARCH_QUERY, { variables: {
    query: query,
    pathwayId: currentPathwayId,
  } });

  const onClickCallback = useCallback((hospitalNumber: string) => {
    dispatch(setModalPatientHospitalNumber(hospitalNumber));
  }, [dispatch]);

  const updateDataCallback: PatientListUpdateDataFn = useCallback(
    ({ selected }) => {
      setCurrentPage(selected);
    }, [setCurrentPage],
  );

  const patientData: PatientListProps['data'] | undefined = useMemo(() => data?.patientSearch.map((p) => {
    const pathway = p.onPathways?.[0];
    const isLockedByOther = (pathway?.lockUser != null)
      && (pathway?.lockUser?.id !== user?.id);
    const mostRecentStage = (
      pathway?.outstandingClinicalRequest?.[0] || pathway?.clinicalRequest?.[0]
    );
    const patient: PatientListProps['data'][0] = {
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      hospitalNumber: p.hospitalNumber,
      dateOfBirth: p.dateOfBirth,
      updatedAt: mostRecentStage?.updatedAt,
      mostRecentStage: mostRecentStage?.clinicalRequestType.name || '',
      isOnPathwayLockedByOther: isLockedByOther,
      lockFirstName: pathway?.lockUser?.firstName,
      lockLastName: pathway?.lockUser?.lastName,
    };
    return patient;
  }), [data?.patientSearch, user?.id]);

  const pageCount = patientData
    ? patientData.length / patientsPerPage
    : 0;

  const start = patientsPerPage * currentPage;
  const end = start + patientsPerPage;
  const patientDataToShow = patientData
    ? patientData.slice(start, end)
    : [];

  return (
    <div className="">
      Search
      {error?.message}
      <PatientList
        updateData={ updateDataCallback }
        data={ patientDataToShow }
        isLoading={ loading }
        onClickCallback={ onClickCallback }
        pageCount={ pageCount }
      />
    </div>
  );
};

export interface AllPatientsProps {
  pathwayId: string;
  patientsPerPage: number;
}

const AllPatients = ({ pathwayId, patientsPerPage }: AllPatientsProps): JSX.Element => {
  const query = useAppSelector((state: RootState) => state.searchBar.query);
  return query
    ? <SearchResults query={ query } patientsPerPage={ patientsPerPage } />
    : (
      <WrappedPatientList
        pathwayId={ pathwayId }
        patientsToDisplay={ patientsPerPage }
        outstanding={ false }
        underCareOf={ false }
        includeDischarged
      />
    );
};

export default AllPatients;
